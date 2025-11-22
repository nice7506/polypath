import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Clock, Target, Zap, ArrowRight, Sparkles, ExternalLink } from 'lucide-react'

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
    setAgentRoadmaps,
    setSelectedAgentId,
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

      // Simulate live logs`
      const simulated = [
  '> [System] Initializing secure E2B cloud sandbox...',
  '> [System] Allocating isolated Linux container...',
  '> [Agent] Spawning parallel research agents...',
  '> [Parallel.ai] Querying verified learning entities...',
  '> [Brave] Scanning latest documentation indices...',
  '> [DuckDuckGo] Scraping community tutorials...',
  '> [System] Verifying Docker installation inside sandbox...',
  '> [System] apt-get update && apt-get install -y docker.io...',
  '> [Search] Aggregating and de-duplicating resources...',
  '> [AI] Cross-referencing found links with learning goals...',
  '> [AI] Gemini 2.5 is synthesizing the final curriculum...',
  '> [Database] Saving finalized roadmap state...',
]
      let simIndex = 0
      simTimer = setInterval(() => {
        addLog(simulated[simIndex % simulated.length])
        simIndex += 1
      }, 1200)

      const data = await realizeSandbox({ roadmapId, strategy, config })
      if (simTimer) clearInterval(simTimer)

      if (data.logs) setLogs(data.logs)
      if (data.agent_roadmaps && data.agent_roadmaps.length) {
        const primary = data.agent_roadmaps[0]
        setRoadmap(primary.roadmap)
        setAgentRoadmaps(data.agent_roadmaps)
        setSelectedAgentId(primary.personaId || null)
      } else if (data.final_roadmap) {
        setRoadmap(data.final_roadmap)
      }
      setSandboxId(data.sandboxId)
    } catch (err: any) {
      setError(err.message || 'Failed to initialize sandbox')
    } finally {
      if (simTimer) clearInterval(simTimer)
      setLoading(null)
      setIsRealizing(false)
    }
  }

  // Map index to a distinct visual theme (keeping it professional, not alarming)
  const getCardTheme = (index: number) => {
    const themes = [
      { border: 'hover:border-cyan-400/50', glow: 'group-hover:shadow-cyan-500/20', icon: Zap, accent: 'text-cyan-400' },
      { border: 'hover:border-purple-400/50', glow: 'group-hover:shadow-purple-500/20', icon: Target, accent: 'text-purple-400' },
      { border: 'hover:border-emerald-400/50', glow: 'group-hover:shadow-emerald-500/20', icon: Sparkles, accent: 'text-emerald-400' },
      { border: 'hover:border-orange-400/50', glow: 'group-hover:shadow-orange-500/20', icon: Clock, accent: 'text-orange-400' },
    ]
    return themes[index % themes.length]
  }

  return (
    <div className="min-h-screen w-full bg-[#0b0f1a] text-white selection:bg-cyan-500/30">
      {/* Background Gradients */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 h-96 w-96 rounded-full bg-cyan-900/20 blur-[128px]" />
        <div className="absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-purple-900/10 blur-[128px]" />
      </div>

      <div className="relative z-10 flex flex-col items-center p-6 md:p-12">
        
        {/* Breadcrumbs / Header */}
        <div className="mb-12 w-full max-w-6xl text-center">
          <div className="mb-4 flex items-center justify-center gap-2 text-xs font-medium tracking-widest text-gray-500 uppercase">
            <span className="text-gray-600">Config</span>
            <ArrowRight className="h-3 w-3" />
            <span className="text-cyan-400">Selection</span>
            <ArrowRight className="h-3 w-3" />
            <span className="text-gray-600">Realization</span>
          </div>
          
          <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-6xl">
            Choose Your Path
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-gray-400">
            We've analyzed your goal of <span className="text-gray-200 font-medium">{config?.goalAlignment || "learning"}</span>. 
            Select the strategy that best fits your schedule and learning style.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid w-full max-w-6xl grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-2">
          {strategies.map((strategy, idx) => {
            const theme = getCardTheme(idx)
            const Icon = theme.icon

            return (
              <div
                key={strategy.name}
                className={`group relative flex flex-col justify-between rounded-2xl border border-white/10 bg-white/[0.02] p-8 backdrop-blur-sm transition-all duration-300 ${theme.border} hover:-translate-y-1 hover:shadow-2xl ${theme.glow}`}
              >
                {/* Card Header */}
                <div>
                  <div className="mb-6 flex items-start justify-between">
                    <div className="rounded-full bg-white/5 p-3 transition-colors group-hover:bg-white/10">
                      <Icon className={`h-6 w-6 ${theme.accent}`} />
                    </div>
                    <div className="flex flex-col items-end">
                      <span className={`text-2xl font-bold ${theme.accent}`}>
                        {strategy.weeks} <span className="text-base font-medium text-gray-500">Weeks</span>
                      </span>
                      <span className="text-xs text-gray-500">Estimated Duration</span>
                    </div>
                  </div>

                  <h3 className="mb-2 text-2xl font-semibold tracking-tight text-white group-hover:text-cyan-100">
                    {strategy.name}
                  </h3>
                  
                  <p className="mb-6 leading-relaxed text-gray-400">
                    {strategy.desc || "A tailored approach focused on hands-on implementation and rapid iteration."}
                  </p>

                  {/* Metadata Tags */}
                  <div className="mb-8 flex flex-wrap gap-2">
                    <div className="inline-flex items-center rounded-md border border-white/5 bg-white/5 px-2.5 py-0.5 text-xs font-medium text-gray-300">
                      {config?.style || "General"}
                    </div>
                    <div className="inline-flex items-center rounded-md border border-white/5 bg-white/5 px-2.5 py-0.5 text-xs font-medium text-gray-300">
                      {config?.level || "Beginner"}
                    </div>
                    {strategy.demoUrl && (
                      <a 
                        href={strategy.demoUrl} 
                        target="_blank" 
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 rounded-md border border-white/5 bg-cyan-500/10 px-2.5 py-0.5 text-xs font-medium text-cyan-400 hover:bg-cyan-500/20 transition-colors"
                      >
                        View Example <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Action Button */}
                <Button
                  onClick={() => handleSelect(strategy)}
                  disabled={!!loading || isRealizing}
                  className={`h-14 w-full text-base font-medium transition-all duration-300
                    ${loading === strategy.name 
                      ? 'cursor-wait bg-gray-700 text-gray-400' 
                      : 'bg-gradient-to-r from-gray-800 to-gray-700 hover:from-cyan-600 hover:to-blue-600 text-white shadow-lg hover:shadow-cyan-500/25 border border-white/5'}
                  `}
                >
                  {loading === strategy.name ? (
                    <span className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 animate-spin" /> Initializing...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Select Strategy <ArrowRight className="h-4 w-4" />
                    </span>
                  )}
                </Button>
              </div>
            )
          })}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-8 rounded-lg border border-red-500/50 bg-red-900/20 px-6 py-4 text-red-200 backdrop-blur">
            <span className="font-bold">Error:</span> {error}
          </div>
        )}
      </div>
    </div>
  )
}
