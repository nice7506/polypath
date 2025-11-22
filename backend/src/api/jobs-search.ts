import { createClient } from "@supabase/supabase-js";
import { searchJobsInSandbox } from "../lib/resume-pipeline.js";

export const config = { runtime: "nodejs", maxDuration: 120 };

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!);

type JobSearchBody = {
  userId?: string;
  role?: string;
  location?: string;
  keywords?: string[];
};

export default async function handler(req: Request) {
  if (req.method !== "POST") return new Response("Method Not Allowed", { status: 405 });

  let body: JobSearchBody;
  try {
    body = await req.json();
  } catch {
    return json({ error: "Invalid JSON payload" }, 400);
  }

  const { userId, role, location, keywords } = body;
  if (!userId || !role) return json({ error: "Required: userId, role" }, 400);

  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
    return json({ error: "Missing Supabase env vars" }, 500);
  }

  const logs: string[] = [];

  try {
    const { results, sandboxId } = await searchJobsInSandbox({ role, location, keywords }, logs);

    let jobMatchId: string | null = null;
    try {
      const { data, error } = await supabase
        .from("job_matches")
        .insert({
          user_id: userId,
          role,
          location,
          keywords,
          results,
        })
        .select("id")
        .single();

      if (error) throw error;
      jobMatchId = data?.id || null;
    } catch (dbError: any) {
      logs.push(`Supabase insert skipped: ${dbError?.message || dbError}`);
    }

    return json({ results, jobMatchId, sandboxId, logs });
  } catch (error: any) {
    logs.push(error?.message || "Failed to search jobs");
    return json({ error: "Job search failed", logs }, 500);
  }
}
