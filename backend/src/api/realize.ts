// src/api/realize.ts
import { Sandbox } from "@e2b/code-interpreter";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { createClient } from "@supabase/supabase-js";

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

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });

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

// --- Main Handler ---
export default async function handler(req: Request) {
  if (req.method !== "POST") return new Response("Method Not Allowed", { status: 405 });

  let body;
  try {
    body = await req.json();
  } catch {
    return json({ error: "Invalid JSON" }, 400);
  }

  const { roadmapId, strategy } = body;
  if (!roadmapId || !strategy) return json({ error: "Missing required fields" }, 400);

  const logs: string[] = [];
  logs.push(`> Strategy Selected: ${strategy.name}`);

  // 1. Retrieve Config (Topic/Level)
  let topic = "Programming";
  let level = "Beginner";
  try {
    const { data } = await supabase.from("roadmaps").select("config").eq("id", roadmapId).single();
    if (data?.config) {
      topic = data.config.topic || topic;
      level = data.config.level || level;
    }
  } catch { /* ignore */ }

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

  // 4. Generate Roadmap via Gemini
  let finalRoadmap: FinalRoadmap | null = null;
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });
    
    const prompt = `
      You are a Senior Curriculum Architect.
      Create a ${strategy.weeks || 4}-week learning roadmap for "${topic}" (${level}).
      
      STRATEGY CONTEXT:
      Name: ${strategy.name}
      Description: ${strategy.desc}

      AVAILABLE RESOURCES (Scraped from Web):
      ${JSON.stringify(uniqueResources.slice(0, 15), null, 2)}

      INSTRUCTIONS:
      1. Create a JSON roadmap with exactly ${strategy.weeks || 4} weeks.
      2. For each week, assign specific goals and mapped resources.
      3. PRIORITIZE the provided scraped resources. If a scraped resource fits a week, use it and set the 'type' accurately.
      4. If no scraped resource fits a specific topic, generate a high-quality placeholder (e.g., "Search for X on YouTube").
      
      OUTPUT JSON FORMAT:
      {
        "title": "string",
        "summary": "string",
        "weeks": [
          {
            "week": number,
            "focus": "string",
            "goals": ["string", "string"],
            "resources": [
              { "type": "video" | "article" | "project", "title": "string", "url": "string", "summary": "string" }
            ]
          }
        ]
      }
    `;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: { responseMimeType: "application/json" },
    });

    finalRoadmap = JSON.parse(result.response.text());
    logs.push("> Gemini successfully constructed roadmap.");

  } catch (error: any) {
    logs.push(`❌ Gemini Generation Failed: ${error.message}`);
    // Fallback basic roadmap
    finalRoadmap = {
      title: `${topic} Roadmap`,
      summary: strategy.desc,
      weeks: Array.from({ length: strategy.weeks || 4 }).map((_, i) => ({
        week: i + 1,
        focus: `Week ${i + 1}`,
        goals: ["Learn core concepts"],
        resources: []
      }))
    };
  }

  // 5. Update Supabase
  const sandboxId = sandboxResult.status === "fulfilled" ? sandboxResult.value.sandboxId : null;
  const dockerOk = sandboxResult.status === "fulfilled" ? sandboxResult.value.dockerOk : false;

  await supabase
    .from("roadmaps")
    .update({
      selected_strategy: strategy,
      sandbox_id: sandboxId,
      logs,
      status: "ready",
      final_roadmap: finalRoadmap,
    })
    .eq("id", roadmapId);

  return json({
    success: true,
    sandboxId,
    dockerOk,
    logs,
    final_roadmap: finalRoadmap
  });
}