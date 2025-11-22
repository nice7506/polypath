import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { useRoadmap } from '@/context/RoadmapContext'
import { realizeSandbox } from '@/lib/api'

export default function StrategyDeck() {
  const navigate = useNavigate()
  const {
    strategies,
    setSelectedStrategy,
    addLog,
    roadmapId,
    setSandboxId,
    setLogs,
    config,
    setRoadmap,
    setIsRealizing,
    isRealizing,
  } = useRoadmap()
  const [loading, setLoading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!strategies.length || !roadmapId) {
      navigate('/start')
    }
  }, [strategies.length, roadmapId, navigate])

  const handleSelect = async (strategy: any) => {
    if (!roadmapId) return navigate('/start')
    setError(null)
    setLoading(strategy.name)
    setIsRealizing(true)
    setLogs([`> Initializing sandbox for "${strategy.name}"...`])
    navigate('/realization')
    let simTimer: ReturnType<typeof setInterval> | null = null
    try {
      setSelectedStrategy(strategy)

      // Simulate live logs while waiting for the backend response.
      const simulated = [
        '> Connecting to E2B sandbox...',
        '> Checking Docker inside sandbox...',
        '> Running docker hello-world...',
        '> Installing numpy/matplotlib...',
      ]
      let simIndex = 0
      simTimer = setInterval(() => {
        addLog(simulated[simIndex % simulated.length])
        simIndex += 1
      }, 1200)

      const data = await realizeSandbox({ roadmapId, strategy })
      if (simTimer) clearInterval(simTimer)

      if (data.logs) setLogs(data.logs)
      if (data.final_roadmap) setRoadmap(data.final_roadmap)
      setSandboxId(data.sandboxId)
    } catch (err: any) {
      setError(err.message || 'Failed to initialize sandbox')
    } finally {
      if (simTimer) clearInterval(simTimer)
      setLoading(null)
      setIsRealizing(false)
    }
  }

  const bgClass = (color: string) => {
    switch (color) {
      case 'red':
        return 'bg-red-900/30 border-red-800'
      case 'blue':
        return 'bg-blue-900/30 border-blue-800'
      case 'green':
        return 'bg-green-900/30 border-green-800'
      default:
        return 'bg-gray-900/50 border-gray-700'
    }
  }

  const buttonClass = (color: string) => {
    switch (color) {
      case 'red':
        return 'bg-red-600 hover:bg-red-500'
      case 'blue':
        return 'bg-blue-600 hover:bg-blue-500'
      case 'green':
        return 'bg-green-600 hover:bg-green-500'
      default:
        return 'bg-gray-600 hover:bg-gray-500'
    }
  }

  const iconBg = (color: string) => {
    switch (color) {
      case 'red':
        return 'bg-red-600'
      case 'blue':
        return 'bg-blue-600'
      case 'green':
        return 'bg-green-600'
      default:
        return 'bg-gray-700'
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      <div className="p-8 text-sm text-gray-500">Configuration / Selection / Realization</div>
      <div className="flex flex-1 items-center justify-center px-12">
        <div className="w-full max-w-7xl space-y-12">
          <div className="space-y-4 text-center">
            <h1 className="text-6xl font-bold">The Strategy Deck</h1>
            <p className="text-lg text-gray-400">
              Review the generated strategies and select one to initialize your learning agents.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {strategies.map((s, idx) => {
              const colors = ['red', 'blue', 'green', 'gray']
              const color = colors[idx % colors.length]
              return (
                <div key={s.name} className={`rounded-2xl border p-8 backdrop-blur ${bgClass(color)}`}>
                  <div className="mb-6 flex items-center justify-between gap-4">
                    <div>
                      <h3 className="text-2xl font-bold">{s.name}</h3>
                      <p className="text-sm text-gray-400">Style: {config?.style || '—'}</p>
                    </div>
                    <div className={`rounded-full px-4 py-2 text-xs ${iconBg(color)}`}>{s.weeks} weeks</div>
                  </div>
                  <p className="mb-8 text-gray-300">Why this fits you: An approach focused on...</p>
                  <div className="mb-6 flex items-center justify-between text-sm text-gray-400">
                    <span>Links: {(s.links || []).length || 0} (Draft)</span>
                    {s.demoUrl && (
                      <a href={s.demoUrl} target="_blank" rel="noreferrer" className="text-cyan-400 underline">
                        Demo URL
                      </a>
                    )}
                  </div>
                  <Button
                    onClick={() => handleSelect(s)}
                    disabled={!!loading || isRealizing}
                    className={`h-12 w-full ${buttonClass(color)} disabled:opacity-60`}
                  >
                    {loading === s.name ? 'Initializing...' : 'Select & Initialize Agents'}
                  </Button>
                </div>
              )
            })}
            {error && <p className="text-sm text-red-400">{error}</p>}
          </div>
        </div>
      </div>
    </div>
  )
}
