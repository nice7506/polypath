import { GoogleGenerativeAI } from "@google/generative-ai";
import { createClient } from "@supabase/supabase-js";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

export const config = { runtime: "nodejs" };

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });

export default async function handler(req) {
  if (req.method !== "POST") return new Response("Method Not Allowed", { status: 405 });

  let body;
  try {
    body = await req.json();
  } catch {
    return json({ error: "Invalid JSON payload" }, 400);
  }

  const { topic, level, style, hours } = body;
  const hoursPerWeek = typeof hours === "string" ? Number(hours) : hours;
  if (!topic || !level || !style || !Number.isFinite(hoursPerWeek)) {
    return json({ error: "Required: topic, level, style, hours (number)" }, 400);
  }

  if (!process.env.GEMINI_API_KEY) return json({ error: "Missing GEMINI_API_KEY" }, 500);
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
    return json({ error: "Missing Supabase env vars" }, 500);
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
    const prompt = `You are a 2025 coding mentor. Given a topic, output exactly 4 strategies as JSON.
Each strategy must include: name, weeks (int), desc, and demoUrl (fake but plausible).
Return ONLY JSON array, no prose.

Topic: ${topic}
Level: ${level}
Style: ${style}
Weekly Hours: ${hoursPerWeek}`;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: { responseMimeType: "application/json" },
    });

    const strategies = JSON.parse(result.response.text());
    if (!Array.isArray(strategies) || strategies.length === 0) {
      throw new Error("Gemini did not return strategies");
    }

    let roadmapId = null;
    try {
      const { data, error } = await supabase
        .from("roadmaps")
        .insert({
          config: { topic, level, style, hours: hoursPerWeek },
          strategies,
          status: "draft",
        })
        .select("id")
        .single();

      if (error) throw error;
      roadmapId = (data === null || data === void 0 ? void 0 : data.id) ?? null;
    } catch (dbError) {
      console.warn("Supabase insert skipped (table missing?):", dbError);
    }

    console.log("Draft strategies response", { roadmapId, count: strategies.length });
    return json({ roadmapId, strategies });
  } catch (error) {
    console.error("draft error", error);
    return json({ error: "Failed to create draft" }, 500);
  }
}
