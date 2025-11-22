// src/api/draft.ts
import { GoogleGenerativeAI } from "@google/generative-ai";
import { createClient } from "@supabase/supabase-js";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!);

export const config = { runtime: "nodejs" };

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });

type DraftBody = {
  topic?: string;
  level?: string;
  style?: string;
  hours?: number;
  goalAlignment?: string;
  budget?: string;
  deviceSpecs?: string;
  preferredTools?: string;
  projectType?: string;
  language?: string;
  deadline?: string;
};

export default async function handler(req: Request) {
  if (req.method !== "POST") return new Response("Method Not Allowed", { status: 405 });

  let body: DraftBody;
  try {
    body = await req.json();
  } catch {
    return json({ error: "Invalid JSON payload" }, 400);
  }

  const {
    topic,
    level,
    style,
    hours,
    goalAlignment,
    budget,
    deviceSpecs,
    preferredTools,
    projectType,
    language,
    deadline,
  } = body;

  const hoursPerWeek = typeof hours === "string" ? Number(hours) : hours;
  if (!topic || !level || !style || !Number.isFinite(hoursPerWeek)) {
    return json({ error: "Required: topic, level, style, hours (number)" }, 400);
  }

  if (!process.env.GEMINI_API_KEY) return json({ error: "Missing GEMINI_API_KEY" }, 500);
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
    return json({ error: "Missing Supabase env vars" }, 500);
  }

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-pro",
    });

    const prompt = `
    You are a Senior Technical Curriculum Architect and Career Coach in 2025. 
    You specialize in creating hyper-personalized learning roadmaps that respect hardware constraints, financial budgets, and hard deadlines.

    INPUT PROFILE:
    - Primary Goal: ${goalAlignment || "General Upskilling"}
    - Topic/Stack: ${language || topic}
    - Current Level: ${level}
    - Learning Style: ${style} (Adapt the curriculum delivery to this)
    - Commitment: ${hoursPerWeek} hours/week
    - Budget: ${budget || "No budget constraints"} (Strictly enforce this)
    - Hardware/Device: ${deviceSpecs || "Standard Laptop"} (Ensure tools run on this)
    - Preferred Tools: ${preferredTools || "Best Industry Standard"}
    - Desired Project: ${projectType || "Portfolio-ready Application"}
    - Hard Deadline: ${deadline || "Flexible"}

    YOUR TASK:
    1. Brainstorm 10 distinct pedagogical strategies based on this profile (e.g., "The Bootcamp Sprint", "The Academic Deep Dive", "The Project-First Hackathon", "The Open Source Contributor", etc.).
    2. Filter these 10 down to the TOP 4 strategies that specifically maximize the user's "Goal Alignment" within their "Deadline" and "Budget".
    3. Output those top 4 strategies as a JSON array.

    OUTPUT FORMAT (JSON ONLY):
    [
      {
        "name": "Catchy Strategy Title",
        "weeks": Integer,
        "desc": "2-3 sentence hook explaining WHY this specific strategy fits their device/budget/goal.",
        "demoUrl": "A plausible (fake) URL example like 'https://github.com/user/demo-project'"
      }
    ]

    CONSTRAINTS:
    - If Device Specs are low (e.g. Chromebook, old laptop), do NOT suggest heavy IDEs or Docker-heavy workflows; suggest cloud IDEs or lightweight tools.
    - If Budget is $0, ONLY suggest free resources (Docs, YouTube, FreeCodeCamp).
    - Return ONLY the JSON array. No markdown formatting, no introduction.
    `;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.7,
      },
    });

    const strategies = JSON.parse(result.response.text());
    if (!Array.isArray(strategies) || strategies.length === 0) {
      throw new Error("Gemini did not return strategies");
    }

    let roadmapId: string | null = null;
    try {
      const { data, error } = await supabase
        .from("roadmaps")
        .insert({
          config: {
            topic,
            level,
            style,
            hours: hoursPerWeek,
            goalAlignment,
            budget,
            deviceSpecs,
            preferredTools,
            projectType,
            language: language || topic,
            deadline,
          },
          strategies,
          status: "draft",
        })
        .select("id")
        .single();

      if (error) throw error;
      roadmapId = data?.id ?? null;
    } catch (dbError) {
      // eslint-disable-next-line no-console
      console.warn("Supabase insert skipped (table missing?):", dbError);
    }

    // eslint-disable-next-line no-console
    console.log("Draft strategies generated", { roadmapId, count: strategies.length });
    return json({ roadmapId, strategies });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("draft error", error);
    return json({ error: "Failed to create draft" }, 500);
  }
}
