// src/api/execute.ts
import { Sandbox } from "@e2b/code-interpreter";

export const config = { runtime: "nodejs" };

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });

type ExecuteBody = {
  sandboxId?: string;
  code?: string;
};

export default async function handler(req: Request) {
  if (req.method !== "POST") return new Response("Not allowed", { status: 405 });

  let body: ExecuteBody;
  try {
    body = await req.json();
  } catch {
    return json({ error: "Invalid JSON payload" }, 400);
  }

  const { sandboxId, code } = body;
  if (!sandboxId || typeof code !== "string") {
    return json({ error: "Required: sandboxId and code" }, 400);
  }

  if (!process.env.E2B_API_KEY) return json({ error: "Missing E2B_API_KEY" }, 500);

  try {
    const sandbox = await Sandbox.connect(sandboxId);

    const stdout: string[] = [];
    const stderr: string[] = [];

    const execution = await sandbox.runCode(code, {
      timeoutMs: 120_000,
      onStdout: (msg) => stdout.push(msg.line),
      onStderr: (msg) => stderr.push(msg.line),
    });

    const mainResult =
      execution.text ||
      execution.results.find((result) => result.text)?.text ||
      null;

    const results = execution.results.map((result) => ({
      text: result.text,
      html: result.html,
      markdown: result.markdown,
      svg: result.svg,
      png: result.png,
      jpeg: result.jpeg,
      data: result.data,
      chart: result.chart,
      raw: result.raw,
    }));

    return json({
      output: mainResult,
      logs: { stdout, stderr },
      results,
      error: execution.error
        ? {
            name: execution.error.name,
            value: execution.error.value,
            traceback: execution.error.traceback,
          }
        : null,
    });
  } catch (error) {
    console.error("execute error", error);
    return json({ error: "Failed to run code in sandbox" }, 500);
  }
}
