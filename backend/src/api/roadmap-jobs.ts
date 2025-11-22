import { createClient } from "@supabase/supabase-js";
import { searchJobsInSandbox } from "../lib/resume-pipeline.js";

export const config = { runtime: "nodejs", maxDuration: 150 };

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!);

type RoadmapJobBody = {
  userId?: string;
  role?: string;
  location?: string;
  keywords?: string[];
  notes?: string;
};

export default async function handler(req: Request) {
  if (req.method !== "POST") return new Response("Method Not Allowed", { status: 405 });

  const url = new URL(req.url);
  const match = url.pathname.match(/\/api\/roadmaps\/([^/]+)\/jobs/);
  const roadmapId = match?.[1];

  if (!roadmapId) return json({ error: "Missing roadmap id" }, 400);

  let body: RoadmapJobBody;
  try {
    body = await req.json();
  } catch {
    return json({ error: "Invalid JSON payload" }, 400);
  }

  const { userId, role, location, keywords, notes } = body;
  if (!userId || !role) return json({ error: "Required: userId, role" }, 400);

  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
    return json({ error: "Missing Supabase env vars" }, 500);
  }

  const logs: string[] = [];

  try {
    const { results, sandboxId } = await searchJobsInSandbox({ role, location, keywords }, logs);

    const jobsBlock = {
      role,
      location,
      keywords,
      notes,
      results,
      updated_at: new Date().toISOString(),
    };

    try {
      const { error } = await supabase
        .from("roadmaps")
        .update({ jobs: jobsBlock })
        .eq("id", roadmapId);
      if (error) throw error;
    } catch (dbError: any) {
      logs.push(`Roadmap jobs update failed: ${dbError?.message || dbError}`);
    }

    try {
      const { error } = await supabase.from("job_matches").insert({
        user_id: userId,
        role,
        location,
        keywords,
        results,
      });
      if (error) throw error;
    } catch (dbError: any) {
      logs.push(`Job_matches insert skipped: ${dbError?.message || dbError}`);
    }

    return json({ jobs: jobsBlock, sandboxId, logs });
  } catch (error: any) {
    logs.push(error?.message || "Failed to attach jobs to roadmap");
    return json({ error: "Failed to attach jobs", logs }, 500);
  }
}
