import { createClient } from "@supabase/supabase-js";
import { compileLatexInSandbox, generateLatexResume } from "../lib/resume-pipeline.js";

export const config = { runtime: "nodejs", maxDuration: 180 };

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!);

type GenerateBody = {
  userId?: string;
  role?: string;
  location?: string;
  keywords?: string[];
};

export default async function handler(req: Request) {
  if (req.method !== "POST") return new Response("Method Not Allowed", { status: 405 });

  let body: GenerateBody;
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
    const { data: resumeRows, error: resumeError } = await supabase
      .from("resumes")
      .select("id, parsed_text")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1);

    if (resumeError) {
      logs.push(`Supabase resumes query failed: ${resumeError.message}`);
    }

    const parsedText = resumeRows?.[0]?.parsed_text as string | undefined;
    if (!parsedText) {
      return json({ error: "No parsed resume found for user", logs }, 404);
    }

    let profile: Record<string, any> | undefined;
    try {
      const { data: roadmapRows, error: roadmapError } = await supabase
        .from("roadmaps")
        .select("config")
        .eq("config->>userId", userId)
        .order("created_at", { ascending: false })
        .limit(1);

      if (roadmapError) throw roadmapError;
      profile = (roadmapRows?.[0]?.config as Record<string, any>) || undefined;
    } catch (profileError: any) {
      logs.push(`Profile lookup skipped: ${profileError?.message || profileError}`);
    }

    const latex = await generateLatexResume(
      { parsedText, role, location, keywords, profile },
      logs,
    );

    const { pdfBase64, sandboxId } = await compileLatexInSandbox(latex, logs);

    let generatedResumeId: string | null = null;
    try {
      const { data, error } = await supabase
        .from("resumes")
        .insert({
          user_id: userId,
          source_url: `generated:${role}`,
          parsed_text: latex,
        })
        .select("id")
        .single();

      if (error) throw error;
      generatedResumeId = data?.id || null;
    } catch (dbError: any) {
      logs.push(`Supabase insert skipped: ${dbError?.message || dbError}`);
    }

    return json({
      latex,
      pdfBase64,
      sandboxId,
      resumeId: generatedResumeId,
      logs,
    });
  } catch (error: any) {
    logs.push(error?.message || "Failed to generate resume.");
    return json({ error: "Failed to generate resume", logs }, 500);
  }
}
