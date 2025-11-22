const API_BASE =
  import.meta.env.VITE_API_BASE ||
  (typeof window !== 'undefined' &&
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? 'http://localhost:3000'
    : '');

type FetchOptions = {
  path: string;
  body?: Record<string, any>;
};

async function request<T>({ path, body }: FetchOptions): Promise<T> {
  const target = `${API_BASE}${path}`;
  const res = await fetch(target, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const raw = await res.text();
  let data: any = raw;
  try {
    data = raw ? JSON.parse(raw) : {};
  } catch {
    throw new Error(`Backend response not JSON (status ${res.status}). Is API running at ${target}?`);
  }
  if (!res.ok) throw new Error(data?.error || `Request failed (status ${res.status})`);
  return data as T;
}

export async function draftStrategies(payload: {
  topic: string;
  level: string;
  style: string;
  hours: number;
}) {
  return request<{ roadmapId: string; strategies: any[] }>({
    path: '/api/draft',
    body: payload,
  });
}

export async function realizeSandbox(payload: { roadmapId: string; strategy: any }) {
  return request<{ success: boolean; sandboxId: string; logs?: string[]; final_roadmap?: any }>({
    path: '/api/realize',
    body: payload,
  });
}

export async function executeCode(payload: { sandboxId: string; code: string }) {
  return request<{
    output: any;
    logs: { stdout: string[]; stderr: string[] };
    results: any[];
    error: any;
  }>({
    path: '/api/execute',
    body: payload,
  });
}
