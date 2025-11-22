import { createClient } from "@supabase/supabase-js";

export const config = { runtime: "nodejs" };

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!);

type SelectBody = {
  roadmapId?: string;
  agentId?: string;
};

export default async function handler(req: Request) {
  if (req.method !== "POST") return new Response("Not allowed", { status: 405 });

  let body: SelectBody;
  try {
    body = await req.json();
  } catch {
    return json({ error: "Invalid JSON payload" }, 400);
  }

  const { roadmapId, agentId } = body;
  if (!roadmapId || !agentId) return json({ error: "Required: roadmapId, agentId" }, 400);

  try {
    const { data, error } = await supabase
      .from("roadmaps")
      .select("agent_roadmaps")
      .eq("id", roadmapId)
      .single();

    if (error || !data) return json({ error: "Roadmap not found" }, 404);

    const agents = (data.agent_roadmaps as any[]) || [];
    const target = agents.find((a: any) => a?.personaId === agentId);

    if (!target) return json({ error: "Agent roadmap not found" }, 404);

    const { error: updateError } = await supabase
      .from("roadmaps")
      .update({
        selected_agent_id: agentId,
        final_roadmap: target.roadmap,
      })
      .eq("id", roadmapId);

    if (updateError) throw updateError;

    return json({ success: true, final_roadmap: target.roadmap, agentId });
  } catch (err: any) {
    console.error("select-agent error", err);
    return json({ error: err?.message || "Failed to select agent roadmap" }, 500);
  }
}

