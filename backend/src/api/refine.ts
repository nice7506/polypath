import { GoogleGenerativeAI } from "@google/generative-ai";
import { createClient } from "@supabase/supabase-js";

export const config = { runtime: "nodejs" };

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!);
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

type RefineBody = {
  roadmapId?: string;
  agentId?: string;
  prompt?: string;
};

export default async function handler(req: Request) {
  if (req.method !== "POST") return new Response("Not allowed", { status: 405 });

  let body: RefineBody;
  try {
    body = await req.json();
  } catch {
    return json({ error: "Invalid JSON payload" }, 400);
  }

  const { roadmapId, agentId, prompt } = body;
  if (!roadmapId || !agentId || !prompt) {
    return json({ error: "Required: roadmapId, agentId, prompt" }, 400);
  }

  if (!process.env.GEMINI_API_KEY) return json({ error: "Missing GEMINI_API_KEY" }, 500);
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
    return json({ error: "Missing Supabase env vars" }, 500);
  }

  try {
    const { data, error } = await supabase
      .from("roadmaps")
      .select("config, selected_strategy, agent_roadmaps, final_roadmap")
      .eq("id", roadmapId)
      .single();

    if (error || !data) {
      return json({ error: "Roadmap not found" }, 404);
    }

    const configData = data.config || {};
    const strategy = data.selected_strategy || {};
    const agents = (data.agent_roadmaps as any[]) || [];
    const targetAgent = agents.find((a: any) => a?.personaId === agentId) || agents[0];
    const baseRoadmap = targetAgent?.roadmap || data.final_roadmap;

    if (!baseRoadmap) {
      return json({ error: "No roadmap available to refine" }, 400);
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });
    const refinePrompt = `
You are refining an existing learning roadmap based on a user prompt.

USER PROMPT:
${prompt}

LEARNER PROFILE:
${JSON.stringify(configData, null, 2)}

SELECTED STRATEGY:
${JSON.stringify(strategy, null, 2)}

CURRENT ROADMAP (JSON):
${JSON.stringify(baseRoadmap, null, 2)}

INSTRUCTIONS:
- Modify the roadmap to satisfy the user prompt.
- Keep the structure: title, summary, weeks[ { week, focus, goals[], resources[] } ].
- Avoid search-result URLs; prefer direct resources.
- Respect constraints: hours/week, targetWeeks, budget, deviceSpecs if present.
- Return ONLY JSON for the refined roadmap.
`;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: refinePrompt }] }],
      generationConfig: { responseMimeType: "application/json" },
    });

    let refined = baseRoadmap;
    try {
      refined = JSON.parse(result.response.text());
    } catch {
      // fallback to base roadmap
    }

    // Update agent_roadmaps with refined version for this agent
    const updatedAgents = agents.map((a: any) =>
      a?.personaId === agentId ? { ...a, roadmap: refined } : a,
    );

    // Persist refined roadmap as final_roadmap + agent_roadmaps
    const { error: updateError } = await supabase
      .from("roadmaps")
      .update({
        final_roadmap: refined,
        agent_roadmaps: updatedAgents,
        selected_agent_id: agentId,
      })
      .eq("id", roadmapId);

    if (updateError) throw updateError;

    return json({ refined_roadmap: refined, agent_roadmaps: updatedAgents, agentId });
  } catch (err: any) {
    console.error("refine error", err);
    return json({ error: err?.message || "Failed to refine roadmap" }, 500);
  }
}

