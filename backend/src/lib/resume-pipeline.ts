import { Sandbox } from "@e2b/code-interpreter";
import { GoogleGenerativeAI } from "@google/generative-ai";

type SandboxStart = {
  sandbox: Sandbox;
  sandboxId: string | null;
};

export type JobResult = {
  title: string;
  company?: string;
  location?: string;
  url: string;
  snippet?: string;
};

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const FIRECRAWL_IMAGE = process.env.FIRECRAWL_IMAGE || "ghcr.io/mendableai/firecrawl:latest";
const FIRECRAWL_CONTAINER = process.env.FIRECRAWL_CONTAINER || "firecrawl-api";
const FIRECRAWL_PORT = process.env.FIRECRAWL_PORT || "3002"; // host-facing inside sandbox
const FIRECRAWL_TARGET_PORT = process.env.FIRECRAWL_TARGET_PORT || "3000"; // container port

const BASE_LATEX_TEMPLATE = String.raw`
%----------------------------------------------------------------------------------------
%	DOCUMENT DEFINITION
%----------------------------------------------------------------------------------------
\documentclass[a4paper,8pt]{extarticle}

%----------------------------------------------------------------------------------------
%	FONT
%----------------------------------------------------------------------------------------
\usepackage{helvet}
\renewcommand{\familydefault}{\sfdefault}

%----------------------------------------------------------------------------------------
%	PACKAGES
%----------------------------------------------------------------------------------------
\usepackage{url}
\usepackage{parskip}
\setlength{\parskip}{0pt}

\usepackage{color}
\usepackage{graphicx}
\usepackage[usenames,dvipsnames]{xcolor}
\usepackage[margin=0.5in]{geometry}

\usepackage{tabularx}
\usepackage{enumitem}
\setlist{nosep,leftmargin=1em,itemsep=2pt}
\newcolumntype{C}{>{\centering\arraybackslash}X}

\usepackage{titlesec}
\usepackage{multicol}
\usepackage{multirow}

\titleformat{\section}{\large\scshape\raggedright}{}{0em}{}[\titlerule]
\titlespacing{\section}{0pt}{4pt}{4pt}

\usepackage[unicode, draft=false]{hyperref}
\definecolor{linkcolour}{rgb}{0,0.2,0.6}
\hypersetup{colorlinks,breaklinks,urlcolor=linkcolour,linkcolor=linkcolour}

\usepackage{fontawesome5}

\begin{document}
\pagestyle{empty}

\begin{tabularx}{\linewidth}{@{} C @{}}
\Huge{\textbf{ {{NAME}} }} \\[5.5pt]
\href{ {{GITHUB_URL}} }{\raisebox{-0.02\height}\faGithub\ GitHub} $|$
\href{ {{LINKEDIN_URL}} }{\raisebox{-0.02\height}\faLinkedin\ LinkedIn} $|$
\href{ {{PORTFOLIO_URL}} }{\raisebox{-0.02\height}\faGlobe\ Portfolio} $|$
\href{mailto:{{EMAIL}}}{\raisebox{-0.02\height}\faEnvelope\ {{EMAIL}}} $|$
\href{tel:{{PHONE_NUMBER}}}{\raisebox{-0.05\height}\faMobile\ {{PHONE_NUMBER}}} \\
\end{tabularx}

\section{Professional Summary}
{{PROFESSIONAL_SUMMARY_TEXT}}

\section{Work Experience}

\begin{tabularx}{\linewidth}{ @{}l r@{} }
\textbf{ {{JOB_TITLE_1}} ({{COMPANY_NAME_1}}) } & \hfill {{START_DATE_1}} -- {{END_DATE_1}} \\[3pt]
\multicolumn{2}{@{}X@{}}{
\begin{minipage}[t]{\linewidth}
\begin{itemize}
  \item[--] {{BULLET_POINT_1_1}}
  \item[--] {{BULLET_POINT_1_2}}
  \item[--] {{BULLET_POINT_1_3}}
\end{itemize}
\end{minipage}
}
\end{tabularx}

\begin{tabularx}{\linewidth}{ @{}l r@{} }
\textbf{ {{JOB_TITLE_2}} ({{COMPANY_NAME_2}}) } & \hfill {{START_DATE_2}} -- {{END_DATE_2}} \\[3pt]
\multicolumn{2}{@{}X@{}}{
\begin{minipage}[t]{\linewidth}
\begin{itemize}
  \item[--] {{BULLET_POINT_2_1}}
  \item[--] {{BULLET_POINT_2_2}}
\end{itemize}
\end{minipage}
}
\end{tabularx}

\begin{tabularx}{\linewidth}{ @{}l r@{} }
\textbf{ {{JOB_TITLE_3}} ({{COMPANY_NAME_3}}) } & \hfill {{START_DATE_3}} -- {{END_DATE_3}} \\[3pt]
\multicolumn{2}{@{}X@{}}{
\begin{minipage}[t]{\linewidth}
\begin{itemize}
  \item[--] {{BULLET_POINT_3_1}}
  \item[--] {{BULLET_POINT_3_2}}
\end{itemize}
\end{minipage}
}
\end{tabularx}

\section{Projects}
\begin{tabularx}{\linewidth}{@{}l r@{}}
\textbf{ {{PROJECT_NAME_1}} ({{TECH_STACK_1}}) } & \hfill \href{ {{PROJECT_URL_1}} }{View Demo} \\[3pt]
\multicolumn{2}{@{}X@{}}{
\begin{minipage}[t]{\linewidth}
\begin{itemize}
  \item[--] {{PROJECT_DESCRIPTION_POINT_1_1}}
  \item[--] {{PROJECT_DESCRIPTION_POINT_1_2}}
\end{itemize}
\end{minipage}
}
\end{tabularx}

\begin{tabularx}{\linewidth}{@{}l r@{}}
\textbf{ {{PROJECT_NAME_2}} ({{TECH_STACK_2}}) } & \hfill \href{ {{PROJECT_URL_2}} }{View Demo} \\[3pt]
\multicolumn{2}{@{}X@{}}{
\begin{minipage}[t]{\linewidth}
\begin{itemize}
  \item[--] {{PROJECT_DESCRIPTION_POINT_2_1}}
  \item[--] {{PROJECT_DESCRIPTION_POINT_2_2}}
\end{itemize}
\end{minipage}
}
\end{tabularx}

\section{Education}
\begin{tabularx}{\linewidth}{@{}l X@{}}
{{START_YEAR}} -- {{END_YEAR}} & \textbf{ {{DEGREE_NAME}} }, {{UNIVERSITY_NAME}} \\
\end{tabularx}

\section{Certifications}
\begin{tabularx}{\linewidth}{@{}l X l@{}}
\textbf{ {{CERTIFICATE_1}} } & & \textbf{ {{CERTIFICATE_2}} } \\
\textbf{ {{CERTIFICATE_3}} } & & \textbf{ {{CERTIFICATE_4}} } \\
\end{tabularx}

\section{Technical Skills}
\begin{tabularx}{\linewidth}{@{}l X@{}}
\textbf{ {{SKILL_CATEGORY_1}}: } & {{SKILL_LIST_1}} \\
\textbf{ {{SKILL_CATEGORY_2}}: } & {{SKILL_LIST_2}} \\
\textbf{ {{SKILL_CATEGORY_3}}: } & {{SKILL_LIST_3}} \\
\textbf{ {{SKILL_CATEGORY_4}}: } & {{SKILL_LIST_4}} \\
\end{tabularx}

\vfill
\end{document}
`.trim();

async function startSandbox(logs: string[]): Promise<SandboxStart | null> {
  if (!process.env.E2B_API_KEY) {
    logs.push("E2B_API_KEY missing; skipping sandbox execution.");
    return null;
  }

  try {
    const template = process.env.E2B_TEMPLATE_ID || "base";
    const sandbox = await Sandbox.create(template, { timeoutMs: 120_000 });
    const sandboxId = (sandbox as any).sandboxId ?? (sandbox as any).id ?? null;
    logs.push(`Sandbox ready${sandboxId ? ` (${sandboxId})` : ""} using template "${template}".`);
    return { sandbox, sandboxId };
  } catch (error: any) {
    logs.push(`Failed to start sandbox: ${error?.message || error}`);
    return null;
  }
}

async function ensureDocker(sandbox: Sandbox, logs: string[]) {
  const check = await sandbox.commands.run("docker --version");
  if (check.exitCode === 0) return;

  logs.push("Docker not found in sandbox. Installing docker.io...");
  await sandbox.commands.run("apt-get update && apt-get install -y docker.io", {
    timeoutMs: 180_000,
    user: "root",
  });
}

async function ensureFirecrawlService(sandbox: Sandbox, logs: string[]) {
  await ensureDocker(sandbox, logs);

  // If already running, skip
  const ps = await sandbox.commands.run(
    `docker ps --filter "name=${FIRECRAWL_CONTAINER}" --format "{{.Status}}"`,
  );
  if (ps.exitCode === 0 && (ps.stdout || "").includes("Up")) {
    logs.push("Firecrawl API already running inside sandbox.");
    return;
  }

  // Clean any stopped container with same name
  await sandbox.commands.run(`docker rm -f ${FIRECRAWL_CONTAINER} 2>/dev/null || true`);

  logs.push(`Starting Firecrawl API container (${FIRECRAWL_IMAGE}) on port ${FIRECRAWL_PORT}...`);
  const run = await sandbox.commands.run(
    [
      "docker run -d",
      `--name ${FIRECRAWL_CONTAINER}`,
      `-p ${FIRECRAWL_PORT}:${FIRECRAWL_TARGET_PORT}`,
      FIRECRAWL_IMAGE,
    ].join(" "),
    { timeoutMs: 120_000 },
  );

  if (run.exitCode !== 0) {
    logs.push(`Failed to start Firecrawl API container: ${run.stderr || "unknown error"}`);
  } else {
    logs.push("Firecrawl API container started.");
  }
}

async function closeSandbox(sandbox: Sandbox | null, logs: string[]) {
  try {
    if (sandbox && typeof (sandbox as any).close === "function") {
      await (sandbox as any).close();
      logs.push("Sandbox closed.");
    }
  } catch {
    // noop - closing failure should not block response
  }
}

export async function extractPdfTextInSandbox(fileUrl: string, logs: string[]) {
  const sandboxInfo = await startSandbox(logs);
  if (!sandboxInfo) return { parsedText: null, sandboxId: null };

  const { sandbox, sandboxId } = sandboxInfo;
  try {
    const download = await sandbox.commands.run(`curl -L "${fileUrl}" -o resume.pdf`);
    if (download.exitCode !== 0) {
      logs.push("Failed to download PDF inside sandbox.");
      return { parsedText: null, sandboxId };
    }

    const parse = await sandbox.commands.run(`
python - <<'PY'
import json, os, subprocess, sys

try:
    from pypdf import PdfReader
except ImportError:
    subprocess.run(
        [sys.executable, "-m", "pip", "install", "-q", "pypdf"],
        check=True,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )
    from pypdf import PdfReader

reader = PdfReader("resume.pdf")
text_chunks = []
for page in reader.pages:
    content = page.extract_text() or ""
    text_chunks.append(content)

print("\\n".join(text_chunks))
PY
    `);

    const parsedText = (parse.stdout || "").trim();
    if (!parsedText) {
      logs.push("Parsed text was empty after extraction.");
      return { parsedText: null, sandboxId };
    }

    logs.push(`Extracted ~${parsedText.length} characters from resume.pdf.`);
    return { parsedText, sandboxId };
  } finally {
    await sandbox.commands.run("rm -f resume.pdf || true");
    await closeSandbox(sandbox, logs);
  }
}

export async function generateLatexResume(
  {
    parsedText,
    role,
    location,
    keywords,
    profile,
  }: {
    parsedText: string;
    role: string;
    location?: string;
    keywords?: string[];
    profile?: Record<string, any>;
  },
  logs: string[],
) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is missing.");
  }

  const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });

  const prompt = `
You are an expert technical resume writer. Fill the provided LaTeX template by replacing all placeholders with concrete content based on the candidate data. Do NOT leave placeholders in the output. Output must be valid LaTeX starting with \\documentclass and ending with \\end{document}, with no markdown fences or extra commentary.

Template to fill:
${BASE_LATEX_TEMPLATE}

Inputs:
- Target role: ${role}
- Location focus: ${location || "Not specified"}
- Keywords to emphasize: ${(keywords || []).join(", ") || "None provided"}
- Parsed resume text (source of facts): """${parsedText.slice(0, 6000)}"""
- Profile/config (optional): ${JSON.stringify(profile || {}, null, 2)}

Guidelines:
- Keep content concise, ATS-friendly, and metric-driven.
- Use real links or leave a plausible placeholder (e.g., "https://github.com/username") if not provided.
- Prefer strongest 2-3 roles/projects; compress older roles.
- Maintain the template structure and package set; do not add new packages.
`.trim();

  const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: { responseMimeType: "text/plain" },
  });

  const latex = result.response.text();
  logs.push(`Generated LaTeX with length ${latex.length}.`);
  return latex;
}

export async function compileLatexInSandbox(latex: string, logs: string[]) {
  const sandboxInfo = await startSandbox(logs);
  if (!sandboxInfo) return { pdfBase64: null, sandboxId: null };

  const { sandbox, sandboxId } = sandboxInfo;
  try {
    const encoded = Buffer.from(latex, "utf8").toString("base64");
    await sandbox.commands.run(`echo "${encoded}" | base64 -d > resume.tex`);

    const latexCheck = await sandbox.commands.run("which xelatex");
    if (latexCheck.exitCode !== 0) {
      logs.push("Installing TeX Live base (with fontawesome) in sandbox...");
      await sandbox.commands.run(
        "apt-get update && apt-get install -y texlive-xetex texlive-latex-recommended texlive-fonts-recommended texlive-fonts-extra",
        { timeoutMs: 180_000, user: "root" },
      );
    }

    const build = await sandbox.commands.run(
      "xelatex -interaction=nonstopmode -halt-on-error resume.tex",
      { timeoutMs: 90_000 },
    );

    if (build.exitCode !== 0) {
      logs.push(`xelatex failed: ${build.stderr || "unknown error"}`);
      return { pdfBase64: null, sandboxId };
    }

    const pdf = await sandbox.commands.run("base64 -w 0 resume.pdf");
    const pdfBase64 = (pdf.stdout || "").trim();
    logs.push("Resume compiled to PDF inside sandbox.");

    await sandbox.commands.run("rm -f resume.tex resume.pdf || true");
    return { pdfBase64, sandboxId };
  } finally {
    await closeSandbox(sandbox, logs);
  }
}

export async function searchJobsInSandbox(
  {
    role,
    location,
    keywords,
  }: {
    role: string;
    location?: string;
    keywords?: string[];
  },
  logs: string[],
): Promise<{ results: JobResult[]; sandboxId: string | null }> {
  const query = [role, location, ...(keywords || [])].filter(Boolean).join(" ").trim();
  const firecrawlUrl =
    process.env.FIRECRAWL_API_URL || `http://127.0.0.1:${FIRECRAWL_PORT}/v1/search`;
  const sandboxInfo = await startSandbox(logs);
  if (!sandboxInfo) {
    logs.push("Skipping sandbox job search; returning empty results.");
    return { results: [], sandboxId: null };
  }

  const { sandbox, sandboxId } = sandboxInfo;
  try {
    await ensureDocker(sandbox, logs);
    const isLocal =
      firecrawlUrl.includes("127.0.0.1") || firecrawlUrl.includes("localhost");
    if (isLocal) {
      await ensureFirecrawlService(sandbox, logs);
    }

    const firecrawlKey = process.env.FIRECRAWL_API_KEY || "";
    const script = `
import json, os, sys, subprocess
from typing import Any, Dict, List, Optional

try:
    import requests
except ImportError:
    subprocess.run(
        [sys.executable, "-m", "pip", "install", "-q", "requests"],
        check=True,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )

query = ${JSON.stringify(query)}
api_key = os.environ.get("FIRECRAWL_API_KEY")
api_url = os.environ.get("FIRECRAWL_API_URL", "https://api.firecrawl.dev/v1/search")
results = []

def read_message(proc) -> Optional[Dict[str, Any]]:
    headers = {}
    # Read headers
    while True:
        line = proc.stdout.readline()
        if line == b"":
            return None
        line = line.decode("utf-8", "ignore").rstrip("\\r\\n")
        if line == "":
            break
        if ":" in line:
            key, val = line.split(":", 1)
            headers[key.lower().strip()] = val.strip()
    content_length = int(headers.get("content-length", "0"))
    if content_length <= 0:
        return None
    body = proc.stdout.read(content_length)
    if not body:
        return None
    return json.loads(body.decode("utf-8", "ignore"))


def run_firecrawl_mcp(q: str) -> Optional[List[Dict[str, Any]]]:
    cmd = ["docker", "run", "-i", "--rm"]
    if api_key:
        cmd += ["-e", f"FIRECRAWL_API_KEY={api_key}"]
    if api_url:
        cmd += ["-e", f"FIRECRAWL_API_URL={api_url}"]
    cmd.append("mcp/firecrawl")
    try:
        proc = subprocess.Popen(
            cmd,
            stdin=subprocess.PIPE,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
        )
    except Exception as exc:
        sys.stderr.write(f"MCP_START_ERROR::{exc}\\n")
        return None

    def send(msg_id: int, method: str, params: Dict[str, Any]):
        payload = {
            "jsonrpc": "2.0",
            "id": msg_id,
            "method": method,
            "params": params,
        }
        data = json.dumps(payload)
        header = f"Content-Length: {len(data)}\\r\\n\\r\\n"
        proc.stdin.write((header + data).encode("utf-8"))
        proc.stdin.flush()

    try:
        send(
            1,
            "initialize",
            {
                "protocolVersion": "2024-11-05",
                "clientInfo": {"name": "polypath-backend", "version": "0.1"},
            },
        )
        # Drain until initialize response
        while True:
            msg = read_message(proc)
            if msg is None:
                break
            if msg.get("id") == 1:
                break

        send(
            2,
            "tools/call",
            {
                "name": "firecrawl_search",
                "arguments": {"query": q, "limit": 6, "sources": ["web"]},
            },
        )

        call_result = None
        while True:
            msg = read_message(proc)
            if msg is None:
                break
            if msg.get("id") == 2:
                call_result = msg
                break

        proc.terminate()
        try:
            proc.wait(timeout=5)
        except subprocess.TimeoutExpired:
            proc.kill()

        if not call_result or "result" not in call_result:
            return None

        content = call_result.get("result", {}).get("content") or []
        # content may be [{type: "text", text: "...json..."}]
        for item in content:
            if isinstance(item, dict) and item.get("type") == "text":
                try:
                    parsed = json.loads(item.get("text", ""))
                    if isinstance(parsed, list):
                        return parsed
                except Exception:
                    continue
        # If content already structured list
        if isinstance(content, list) and all(isinstance(x, dict) for x in content):
            return content  # type: ignore
    except Exception as exc:
        sys.stderr.write(f"MCP_CALL_ERROR::{exc}\\n")
    return None


def run_firecrawl_http(q: str) -> Optional[List[Dict[str, Any]]]:
    try:
        resp = requests.post(
            api_url or "https://api.firecrawl.dev/v1/search",
            headers={"Authorization": f"Bearer {api_key}"},
            json={"query": q, "page": 1, "num_results": 6},
            timeout=30,
        )
        data = resp.json() if resp.content else {}
        hits = data.get("data") or data.get("results") or []
        rows = []
        for item in hits[:8]:
            rows.append({
                "title": item.get("title") or item.get("name") or "",
                "company": item.get("company") or item.get("source") or "",
                "location": item.get("location") or ${JSON.stringify(location || "")},
                "url": item.get("url") or item.get("link") or "",
                "snippet": item.get("description") or item.get("summary") or "",
            })
        return rows
    except Exception as exc:
        sys.stderr.write(f"FIRECRAWL_HTTP_ERROR::{exc}\\n")
        return None


results = run_firecrawl_mcp(query)
if not results:
    results = run_firecrawl_http(query) or []

if not results:
    # Fallback mock data to keep the flow alive
    results = [
        {
            "title": f"{query} - Lead Opportunity",
            "company": "ExampleCo",
            "location": ${JSON.stringify(location || "Remote")},
            "url": "https://jobs.example.com/sample",
            "snippet": "Generated fallback listing while Firecrawl is unavailable.",
        }
    ]

print(json.dumps(results))
`;

    const run = await sandbox.commands.run(
      `FIRECRAWL_API_KEY="${firecrawlKey}" FIRECRAWL_API_URL="${firecrawlUrl}" python - <<'PY'\n${script}\nPY`,
      { timeoutMs: 60_000 },
    );

    const stdout = run.stdout || "";
    const stderr = run.stderr || "";

    const errorLine =
      stderr
        .split("\n")
        .find((line) => line.startsWith("FIRECRAWL_") || line.startsWith("MCP_")) || null;
    if (errorLine) logs.push(errorLine);

    let parsed: JobResult[] = [];
    try {
      parsed = JSON.parse(stdout.trim()) as JobResult[];
    } catch {
      logs.push("Failed to parse job search output; returning empty list.");
    }

    return { results: parsed, sandboxId };
  } finally {
    await closeSandbox(sandbox, logs);
  }
}
