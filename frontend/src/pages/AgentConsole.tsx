import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { useRoadmap } from '@/context/RoadmapContext'

export default function AgentConsole() {
  const navigate = useNavigate()
  const { logs, sandboxId, isRealizing } = useRoadmap()

  useEffect(() => {
    if (!sandboxId && !isRealizing) {
      navigate('/start')
    }
  }, [sandboxId, isRealizing, navigate])

  useEffect(() => {
    if (sandboxId && !isRealizing) {
      navigate('/roadmap')
    }
  }, [sandboxId, isRealizing, navigate])

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
              {logs.length ? (
                logs.map((log, i) => <div key={i}>{log}</div>)
              ) : (
                <div className="text-gray-500">
                  {isRealizing ? 'Initializing sandbox and streaming logs...' : 'Waiting for sandbox logs...'}
                </div>
              )}
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
