import { Sandbox } from "@e2b/code-interpreter";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

export const config = { runtime: "nodejs" };

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });

export default async function handler(req) {
  if (req.method !== "POST") return new Response("Not allowed", { status: 405 });

  let body;
  try {
    body = await req.json();
  } catch {
    return json({ error: "Invalid JSON payload" }, 400);
  }

  const { roadmapId, strategy } = body || {};
  if (!roadmapId || !strategy) {
    return json({ error: "Required: roadmapId and strategy" }, 400);
  }

  if (!process.env.E2B_API_KEY) return json({ error: "Missing E2B_API_KEY" }, 500);
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
    return json({ error: "Missing Supabase env vars" }, 500);
  }

  const logs = [];

  let config = null;

  try {
    // Try to fetch config/topic for richer roadmap content
    const { data: cfgRow, error: cfgErr } = await supabase.from("roadmaps").select("config").eq("id", roadmapId).single();
    if (!cfgErr && cfgRow?.config) {
      config = cfgRow.config;
    }
  } catch (err) {
    logs.push(`Config fetch skipped: ${err?.message || err}`);
  }

  try {
    // E2B caps timeout to 1 hour for this plan; request the max allowed (60 minutes).
    const sandbox = await Sandbox.create("base", {
      timeoutMs: 1000 * 60 * 60,
    });

    const sandboxId = sandbox.sandboxId || sandbox.id;

    const addLogs = (prefix, text) => {
      if (!text) return;
      text
        .split("\n")
        .filter(Boolean)
        .forEach((line) => logs.push(`${prefix}${line}`));
    };

    const runCmd = async (cmd, opts = {}) => {
      try {
        const res = await sandbox.commands.run(cmd, opts);
        addLogs(`${cmd} stdout: `, res.stdout);
        addLogs(`${cmd} stderr: `, res.stderr);
        logs.push(`${cmd} exit: ${res.exitCode}`);
        return res;
      } catch (err) {
        // CommandExitError still has result; surface it
        const res = err?.result || { exitCode: 1, stdout: "", stderr: String(err || "") };
        addLogs(`${cmd} stdout: `, res.stdout);
        addLogs(`${cmd} stderr: `, res.stderr);
        logs.push(`${cmd} exit: ${res.exitCode}`);
        return res;
      }
    };

    logs.push("Initializing E2B sandbox...");
    logs.push(`Sandbox ID: ${sandboxId}`);

    const dockerCheck = await runCmd("command -v docker");
    if (dockerCheck.exitCode !== 0) {
      logs.push("Docker not found; installing via apt-get...");
      await runCmd("apt-get update", { user: "root", timeoutMs: 180_000 });
      await runCmd("apt-get install -y docker.io", { user: "root", timeoutMs: 300_000 });
    }

    const dockerRun = await runCmd("docker run --rm hello-world", { timeoutMs: 180_000 });
    const installDeps = await runCmd("pip install -q numpy matplotlib", { timeoutMs: 180_000 });

    const buildRoadmap = (plan) => {
      const totalWeeks = Number(plan?.weeks) && plan.weeks > 0 ? plan.weeks : 4;
      const topic = config?.topic || "your topic";
      const level = config?.level || "Intermediate";
      const weeklyHours = config?.hours || 5;

      const baseResources = [
        {
          type: "video",
          title: `Crash Course: ${topic}`,
          url: "https://www.youtube.com/results?search_query=" + encodeURIComponent(`${topic} tutorial`),
          summary: `Fast start on ${topic} for ${level} learners.`,
        },
        {
          type: "doc",
          title: `${topic} Official Docs`,
          url: "https://www.google.com/search?q=" + encodeURIComponent(`${topic} official docs`),
          summary: "Canonical reference and examples.",
        },
        {
          type: "project",
          title: `${topic} mini project`,
          url: "https://github.com",
          summary: "Ship a small build to cement skills.",
        },
      ];

      const weeks = Array.from({ length: totalWeeks }, (_, i) => ({
        week: i + 1,
        focus: `Milestone ${i + 1}: ${topic} | ${plan?.name || "strategy"}`,
        goals: [
          `Study core ${topic} concept ${i + 1}`,
          `Complete an applied exercise for ${topic}`,
          "Summarize learnings in a journal",
        ],
        resources: baseResources,
        actionItems: [
          `Allocate ${weeklyHours}h this week`,
          "Pair doc reading with a video",
          "Build a tiny demo that uses the new concept",
          "Write down blockers and questions",
        ],
      }));

      return {
        title: `${plan?.name || "Roadmap"} Roadmap`,
        summary:
          plan?.desc ||
          plan?.description ||
          `Roadmap for ${topic} at ${level} level with ${weeklyHours}h/week commitment.`,
        duration_weeks: totalWeeks,
        verified: true,
        weeks,
      };
    };

    const finalRoadmap = buildRoadmap(strategy);

    try {
      const roadmapUpdate = await supabase
        .from("roadmaps")
        .update({
          selected_strategy: strategy,
          sandbox_id: sandboxId,
          logs,
          status: "ready",
          final_roadmap: finalRoadmap,
        })
        .eq("id", roadmapId);

      if (roadmapUpdate.error) throw roadmapUpdate.error;
    } catch (dbError) {
      logs.push(`Supabase update skipped/failed: ${dbError?.message || dbError}`);
    }

    const dockerOk = dockerRun.exitCode === 0;

    return json({
      success: dockerOk,
      sandboxId,
      message: dockerOk ? "E2B sandbox + Docker ready!" : "Sandbox ready but Docker failed",
      docker: dockerRun.stdout,
      logs,
      final_roadmap: finalRoadmap,
      docker_error: dockerOk ? null : dockerRun.stderr || dockerRun.error || "docker failed",
      pip_exit: installDeps.exitCode,
    });
  } catch (error) {
    console.error("realize error", error);
    logs.push(`Realize error: ${error?.message || error}`);
    return json({
      success: false,
      message: "Failed to initialize sandbox",
      logs,
      error: error?.message || String(error || ""),
    });
  }
}
