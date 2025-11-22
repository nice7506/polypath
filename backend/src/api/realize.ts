// src/api/realize.ts
import { Sandbox } from "@e2b/code-interpreter";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { createClient } from "@supabase/supabase-js";
import { AGENT_PERSONAS, type AgentPersona } from "../agents/personas.js";

// --- Configuration & Types ---
export const config = {
  runtime: "nodejs",
  maxDuration: 60, // Allow 60s for slow APIs (Parallel/E2B)
};

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!);
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

interface ScrapedResource {
  title: string;
  url: string;
  source: "Brave" | "Parallel" | "DuckDuckGo";
  snippet?: string;
}

interface RoadmapWeek {
  week: number;
  focus: string;
  goals: string[];
  resources: {
    type: "video" | "article" | "project" | "course";
    title: string;
    url: string;
    summary: string;
  }[];
}

interface FinalRoadmap {
  title: string;
  summary: string;
  weeks: RoadmapWeek[];
}

interface AgentRoadmapResult {
  personaId: string;
  personaName: string;
  roadmap: FinalRoadmap;
}

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });

type RealizeBody = {
  roadmapId?: string;
  strategy?: {
    name?: string;
    weeks?: number;
    desc?: string;
    [key: string]: unknown;
  };
  config?: any;
};


// --- 1. Brave Search API (Free Tier) ---
async function searchBrave(query: string, logs: string[]): Promise<ScrapedResource[]> {
  const apiKey = process.env.BRAVE_API_KEY;
  if (!apiKey) {
    logs.push("⚠️ Brave API key missing. Skipping.");
    return [];
  }

  try {
    const url = new URL("https://api.search.brave.com/res/v1/web/search");
    url.searchParams.append("q", query);
    url.searchParams.append("count", "5"); // Free tier friendly

    const response = await fetch(url.toString(), {
      headers: {
        "Accept": "application/json",
        "Accept-Encoding": "gzip",
        "X-Subscription-Token": apiKey,
      },
    });

    if (!response.ok) {
      throw new Error(`Brave responded with ${response.status}`);
    }

    const data = await response.json();
    const results = data.web?.results || [];

    logs.push(`✅ Brave returned ${results.length} results.`);
    
    return results.map((r: any) => ({
      title: r.title,
      url: r.url,
      snippet: r.description,
      source: "Brave",
    }));
  } catch (error: any) {
    logs.push(`❌ Brave Search failed: ${error.message}`);
    return [];
  }
}

// --- 2. Parallel AI FindAll (Deep Entity Search) ---
async function searchParallel(topic: string, logs: string[]): Promise<ScrapedResource[]> {
  const apiKey = process.env.PARALLEL_API_KEY;
  if (!apiKey) {
    logs.push("⚠️ Parallel API key missing. Skipping.");
    return [];
  }

  const headers = {
    "x-api-key": apiKey,
    "parallel-beta": "findall-2025-09-15",
    "Content-Type": "application/json",
  };

  try {
    // 1. Start Run
    const startRes = await fetch("https://api.parallel.ai/v1beta/findall/runs", {
      method: "POST",
      headers,
      body: JSON.stringify({
        objective: `Find the best free documentation, video courses, and tutorials for learning ${topic}.`,
        entity_type: "learning_resource",
        match_conditions: [
          { name: "relevance", description: `Must be about ${topic}` },
          { name: "quality", description: "Must be high quality or official documentation" }
        ],
        generator: "core", // Cheaper/Faster
        match_limit: 5,
      }),
    });

    if (!startRes.ok) throw new Error(`Parallel Start: ${startRes.statusText}`);
    const { findall_id } = await startRes.json();

    // 2. Poll (Max 10 attempts ~25s)
    let attempts = 0;
    while (attempts < 10) {
      await new Promise((r) => setTimeout(r, 2500));
      attempts++;

      const checkRes = await fetch(`https://api.parallel.ai/v1beta/findall/runs/${findall_id}`, { headers });
      const checkData = await checkRes.json();

      if (checkData.status?.status === "completed") {
        // 3. Get Results
        const resRes = await fetch(`https://api.parallel.ai/v1beta/findall/runs/${findall_id}/result`, { headers });
        const resData = await resRes.json();
        
        logs.push(`✅ Parallel found ${resData.candidates?.length || 0} verified entities.`);
        return (resData.candidates || []).map((c: any) => ({
          title: c.name,
          url: c.url,
          snippet: c.description,
          source: "Parallel",
        }));
      } else if (checkData.status?.status === "failed") {
        throw new Error("Parallel run failed internally.");
      }
    }
    logs.push("❌ Parallel timed out.");
    return [];
  } catch (error: any) {
    logs.push(`❌ Parallel error: ${error.message}`);
    return [];
  }
}

// --- 3. DuckDuckGo Scraper (Free Fallback) ---
async function searchDuckDuckGo(query: string, logs: string[]): Promise<ScrapedResource[]> {
  try {
    // Using the html endpoint which is easier to scrape than the dynamic JS site
    const response = await fetch(`https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    });

    if (!response.ok) throw new Error("DDG blocked request");

    const html = await response.text();
    const results: ScrapedResource[] = [];
    
    // Simple regex to extract results from DDG HTML structure
    // Looks for: <a class="result__a" href="...">Title</a>
    const linkRegex = /class="result__a"\s+href="([^"]+)">([^<]+)<\/a>/g;
    const snippetRegex = /class="result__snippet"\s+href="[^"]+">([^<]+)<\/a>/g;

    let match;
    let count = 0;
    while ((match = linkRegex.exec(html)) !== null && count < 4) {
      // Decode URL (DDG wraps them sometimes)
      let url = match[1];
      if (url.startsWith("/l/?kh=-1&uddg=")) {
        url = decodeURIComponent(url.split("uddg=")[1]);
      }
      
      results.push({
        title: match[2],
        url: url,
        source: "DuckDuckGo",
        snippet: "Found via DuckDuckGo Search", // Snippets are harder to map 1:1 with regex
      });
      count++;
    }

    logs.push(`✅ DuckDuckGo scraped ${results.length} results.`);
    return results;
  } catch (error: any) {
    logs.push(`❌ DuckDuckGo failed: ${error.message}`);
    return [];
  }
}

// --- 4. E2B Sandbox Logic ---
async function initSandbox(logs: string[]) {
  logs.push("🛠 Initializing E2B Sandbox...");
  if (!process.env.E2B_API_KEY) {
    logs.push("⚠️ E2B_API_KEY missing. Skipping sandbox.");
    return { sandboxId: null, dockerOk: false };
  }

  try {
    const sandbox = await Sandbox.create("base", { timeoutMs: 60_000 });
    const sandboxId = (sandbox as any).sandboxId ?? (sandbox as any).id;
    
    logs.push(`✅ Sandbox Created: ${sandboxId}`);
    
    // Check Docker
    const check = await sandbox.commands.run("docker --version");
    const dockerOk = check.exitCode === 0;
    
    if (!dockerOk) {
        logs.push("Installing Docker in sandbox...");
        await sandbox.commands.run("apt-get update && apt-get install -y docker.io", { timeoutMs: 120_000, user: 'root' });
    }
    
    // Don't keep connection open, just verify it works
    
    return { sandboxId, dockerOk: true };
  } catch (error: any) {
    logs.push(`❌ E2B Error: ${error.message}`);
    return { sandboxId: null, dockerOk: false };
  }
}

async function generateRoadmapForPersona(
  persona: AgentPersona,
  {
    config,
    strategy,
    topic,
    level,
    targetDuration,
    resources,
    logs,
  }: {
    config: any;
    strategy: any;
    topic: string;
    level: string;
    targetDuration: number;
    resources: ScrapedResource[];
    logs: string[];
  },
): Promise<AgentRoadmapResult> {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });

  try {
    logs.push(`> [Agent: ${persona.name}] Generating roadmap...`);

    const prompt = `
You are acting as the following curriculum agent:

AGENT PERSONA:
- Name: ${persona.name}
- Role: ${persona.role}
- Style: ${persona.style}
- Emphasis: ${persona.emphasis}

Your job, as this persona, is to produce a concrete, resource-backed roadmap.

LEARNER PROFILE:
- Primary Goal: ${config?.goalAlignment || "General Upskilling"}
- Topic / Stack: ${config?.language || topic}
- Current Level: ${level}
- Preferred Style(s): ${config?.style || "Any"}
- Weekly Commitment: ${config?.hours || "Not specified"} hours/week
- Target Duration: ${targetDuration} weeks
- Budget: ${config?.budget || "Unspecified"} (respect this)
- Hardware / Device: ${config?.deviceSpecs || "Standard laptop"} (avoid tools that won't run here)
- Preferred Tools: ${config?.preferredTools || "Any popular tools"}
- Desired Project Type: ${config?.projectType || "Portfolio-ready application"}
- Hard Deadline: ${config?.deadline || "Flexible / none"}

SELECTED STRATEGY (chosen earlier in the flow):
- Strategy Name: ${strategy.name}
- Strategy Description: ${strategy.desc}
- Strategy Weeks: ${strategy.weeks || "Not specified"}

SCRAPED RESOURCES (web search results you may use):
${JSON.stringify(resources.slice(0, 15), null, 2)}

PERSONA-SPECIFIC GUIDANCE:
- As ${persona.name}, you should especially favor resources that match this emphasis: ${persona.emphasis}.
- You may ignore scraped resources that don't fit this emphasis or the user's constraints.

INSTRUCTIONS:
1. Create a JSON roadmap with exactly ${targetDuration} weeks.
2. For each week, define:
   - "focus": a clear theme or milestone.
   - "goals": 2–4 concise learner goals.
   - "resources": 1–3 resources that help achieve those goals.
3. PRIORITIZE the provided scraped resources. If a scraped resource fits a week, use it and set "type" accurately.
4. Avoid search-result URLs (Google/YouTube search pages). Prefer direct content URLs only.
5. Respect budget and hardware constraints when choosing tools and resources.
6. If you do not see a good URL for a topic in SCRAPED RESOURCES, you may omit the resource instead of inventing a search URL.

OUTPUT JSON FORMAT (NO prose, NO markdown):
{
  "title": "string",
  "summary": "string",
  "weeks": [
    {
      "week": number,
      "focus": "string",
      "goals": ["string", "string"],
      "resources": [
        { "type": "video" | "article" | "project" | "course", "title": "string", "url": "string", "summary": "string" }
      ]
    }
  ]
}
`.trim();

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: { responseMimeType: "application/json" },
    });

    const raw = result.response.text();
    const parsed = JSON.parse(raw) as FinalRoadmap;

    if (!parsed || !Array.isArray(parsed.weeks)) {
      throw new Error("Persona roadmap JSON missing weeks.");
    }

    logs.push(`> [Agent: ${persona.name}] Roadmap ready with ${parsed.weeks.length} weeks.`);

    return {
      personaId: persona.id,
      personaName: persona.name,
      roadmap: parsed,
    };
  } catch (error: any) {
    logs.push(`❌ [Agent: ${persona.name}] failed: ${error?.message || error}`);
    const fallback: FinalRoadmap = {
      title: `${persona.name} – ${config?.topic || topic} Roadmap`,
      summary: strategy.desc || `Fallback roadmap created by ${persona.name}.`,
      weeks: Array.from({ length: targetDuration }).map((_, i) => ({
        week: i + 1,
        focus: `Week ${i + 1}`,
        goals: ["Learn core concepts"],
        resources: [],
      })),
    };

    return {
      personaId: persona.id,
      personaName: persona.name,
      roadmap: fallback,
    };
  }
}

// --- Main Handler ---
export default async function handler(req: Request) {
  if (req.method !== "POST") return new Response("Method Not Allowed", { status: 405 });

  let body;
  try {
    body = await req.json();
  } catch {
    return json({ error: "Invalid JSON" }, 400);
  }

  const { roadmapId, strategy, config: configFromBody } = body as RealizeBody;
  if (!roadmapId || !strategy) return json({ error: "Missing required fields" }, 400);

  const logs: string[] = [];
  logs.push(`> Strategy Selected: ${strategy.name}`);

  // 1. Retrieve Config (Topic/Level)
  let config: any = configFromBody || null;
  let topic = config?.topic || "Programming";
  let level = config?.level || "Beginner";
  const targetDuration = (config?.targetWeeks && Number(config.targetWeeks)) || (strategy.weeks && Number(strategy.weeks)) || 4;

  // If config not provided in the request body, fall back to Supabase.
  if (!config) {
    try {
      const { data } = await supabase.from("roadmaps").select("config").eq("id", roadmapId).single();
      if (data?.config) {
        config = data.config;
        topic = config.topic || topic;
        level = config.level || level;
      }
    } catch {
      // ignore; we'll proceed with default topic/level
    }
  }

  // 2. PARALLEL EXECUTION: Run all external calls at once
  // We use allSettled so one failure doesn't stop the others
  const searchQuery = `${topic} ${level} learning resources tutorials`;
  
  logs.push(`> Starting Multi-Source Search for: "${searchQuery}"`);

  const [sandboxResult, parallelRes, braveRes, ddgRes] = await Promise.allSettled([
    initSandbox(logs),
    searchParallel(topic, logs),
    searchBrave(searchQuery, logs),
    searchDuckDuckGo(searchQuery, logs)
  ]);

  // 3. Aggregate Resources
  let allResources: ScrapedResource[] = [];

  if (parallelRes.status === "fulfilled") allResources.push(...parallelRes.value);
  if (braveRes.status === "fulfilled") allResources.push(...braveRes.value);
  if (ddgRes.status === "fulfilled") allResources.push(...ddgRes.value);

  // Dedup resources by URL
  const uniqueResources = Array.from(new Map(allResources.map(item => [item.url, item])).values());
  logs.push(`> Aggregated ${uniqueResources.length} unique resources.`);

  // 4. Multi-agent Gemini roadmaps (four personas)
  let agentRoadmaps: AgentRoadmapResult[] = [];
  try {
    agentRoadmaps = await Promise.all(
      AGENT_PERSONAS.map((persona) =>
        generateRoadmapForPersona(persona, {
          config,
          strategy,
          topic,
          level,
          targetDuration,
          resources: uniqueResources,
          logs,
        }),
      ),
    );
  } catch (err: any) {
    logs.push(`❌ Multi-agent generation error: ${err?.message || err}`);
  }

  const finalRoadmap: FinalRoadmap =
    agentRoadmaps[0]?.roadmap || {
      title: `${topic} Roadmap`,
      summary: strategy.desc,
      weeks: Array.from({ length: targetDuration }).map((_, i) => ({
        week: i + 1,
        focus: `Week ${i + 1}`,
        goals: ["Learn core concepts"],
        resources: [],
      })),
    };

  // 5. Update Supabase
  const sandboxId = sandboxResult.status === "fulfilled" ? sandboxResult.value.sandboxId : null;
  const dockerOk = sandboxResult.status === "fulfilled" ? sandboxResult.value.dockerOk : false;

  const selectedAgentId = agentRoadmaps[0]?.personaId || null;

  await supabase
    .from("roadmaps")
    .update({
      selected_strategy: strategy,
      sandbox_id: sandboxId,
      logs,
      status: "ready",
      final_roadmap: finalRoadmap,
      agent_roadmaps: agentRoadmaps,
      selected_agent_id: selectedAgentId,
    })
    .eq("id", roadmapId);

  return json({
    success: true,
    sandboxId,
    dockerOk,
    logs,
    final_roadmap: finalRoadmap,
    agent_roadmaps: agentRoadmaps,
  });
}
