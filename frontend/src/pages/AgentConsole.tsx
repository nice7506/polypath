import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { useRoadmap } from '@/context/RoadmapContext'

const fakeLogs = [
  'Executing Agent...',
  '> Initializing E2B Sandbox environment...',
  '> Docker: Pulling image [poly-agent:latest]...',
  '> Gemini: Identifying search targets...',
  '> Agent: Visiting https://react.dev/learn...',
  '[INFO] Page loaded successfully. Analyzing content.',
  '> RAG: Embedding content... 128 chunks created.',
  '> Process complete. Preparing results...',
]

export default function AgentConsole() {
  const navigate = useNavigate()
  const { addLog, logs } = useRoadmap()

  useEffect(() => {
    fakeLogs.forEach((log, i) => {
      setTimeout(() => {
        addLog(log)
        if (i === fakeLogs.length - 1) {
          setTimeout(() => navigate('/roadmap'), 2000)
        }
      }, i * 1200)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="flex min-h-screen flex-col bg-black text-green-400">
      <div className="flex items-center gap-4 p-8">
        <div className="h-12 w-12 animate-pulse rounded-full bg-red-500" />
        <h1 className="text-4xl font-bold text-white">PolyPath</h1>
      </div>

      <div className="flex flex-1 items-center justify-center px-16">
        <div className="w-full max-w-5xl">
          <h2 className="mb-12 text-center text-4xl font-bold text-white">Agent Console</h2>

          <div className="rounded-lg border-4 border-green-500 bg-black p-8 font-mono text-lg">
            <div className="mb-4 flex items-center gap-4">
              <div className="flex gap-2">
                <div className="h-4 w-4 rounded-full bg-red-500" />
                <div className="h-4 w-4 rounded-full bg-yellow-500" />
                <div className="h-4 w-4 rounded-full bg-green-500" />
              </div>
              <span className="text-gray-500">bash — polypath/agent.sh</span>
            </div>

            <div className="mt-8 space-y-3">
              {logs.map((log, i) => (
                <div key={i}>{log}</div>
              ))}
              <div className="animate-pulse">█</div>
            </div>
          </div>

          <div className="mt-12 flex justify-center gap-4">
            <div className="h-12 w-12 rounded-full border-4 border-dashed bg-gray-600" />
            <div className="mt-4 text-gray-400">Agents are on the job</div>
          </div>
        </div>
      </div>
    </div>
  )
}
