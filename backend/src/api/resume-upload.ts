import { createClient } from "@supabase/supabase-js";
import { extractPdfTextInSandbox } from "../lib/resume-pipeline.js";

export const config = { runtime: "nodejs", maxDuration: 120 };

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!);

type UploadBody = {
  userId?: string;
  fileUrl?: string;
};

export default async function handler(req: Request) {
  if (req.method !== "POST") return new Response("Method Not Allowed", { status: 405 });

  let body: UploadBody;
  try {
    body = await req.json();
  } catch {
    return json({ error: "Invalid JSON payload" }, 400);
  }

  const { userId, fileUrl } = body;
  if (!userId || !fileUrl) return json({ error: "Required: userId, fileUrl" }, 400);

  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
    return json({ error: "Missing Supabase env vars" }, 500);
  }

  const logs: string[] = [];

  try {
    const { parsedText, sandboxId } = await extractPdfTextInSandbox(fileUrl, logs);
    if (!parsedText) {
      return json({ error: "Failed to parse resume", logs, sandboxId }, 500);
    }

    let resumeId: string | null = null;
    try {
      const { data, error } = await supabase
        .from("resumes")
        .insert({
          user_id: userId,
          source_url: fileUrl,
          parsed_text: parsedText,
        })
        .select("id")
        .single();

      if (error) throw error;
      resumeId = data?.id || null;
    } catch (dbError: any) {
      logs.push(`Supabase insert skipped: ${dbError?.message || dbError}`);
    }

    return json({ resumeId, parsedText, logs, sandboxId });
  } catch (error: any) {
    logs.push(error?.message || "Unexpected error during upload.");
    return json({ error: "Failed to ingest resume", logs }, 500);
  }
}
