import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle2, PlayCircle, BookOpen, Code2, ExternalLink, Target, Loader2, Wand2, Sparkles } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useRoadmap } from '@/context/RoadmapContext'
import { fetchRoadmapById, refineRoadmap, selectAgentRoadmap } from '@/lib/api'

const personaLabel = (id: string) => {
  if (id === 'systems-architect') return 'Structured, fundamentals-first.'
  if (id === 'project-hacker') return 'Project-heavy, build-first.'
  if (id === 'research-mentor') return 'Deep theory & explainers.'
  if (id === 'constraints-optimizer') return 'Optimized for time/budget/device.'
  return 'Alternative agentic route.'
}

export default function RefineRoadmap() {
  const navigate = useNavigate()
  const {
    roadmapId,
    roadmap,
    agentRoadmaps,
    selectedAgentId,
    setRoadmap,
    setAgentRoadmaps,
    setSelectedAgentId,
    selectedStrategy,
  } = useRoadmap()

  const [prompt, setPrompt] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      if (!roadmapId) {
        navigate('/start')
        return
      }
      if (agentRoadmaps && agentRoadmaps.length) return
      try {
        const row = await fetchRoadmapById(roadmapId)
        if (row?.agent_roadmaps) setAgentRoadmaps(row.agent_roadmaps)
        if (row?.selected_agent_id) setSelectedAgentId(row.selected_agent_id)
        if (row?.final_roadmap) setRoadmap(row.final_roadmap)
      } catch (err: any) {
        console.error('Refine load error', err)
        setError(err?.message || 'Failed to load roadmap.')
      }
    }
    load()
  }, [agentRoadmaps, navigate, roadmapId, setAgentRoadmaps, setRoadmap, setSelectedAgentId])

  const activeAgentId = useMemo(
    () => selectedAgentId || agentRoadmaps?.[0]?.personaId || null,
    [selectedAgentId, agentRoadmaps],
  )

  const activeAgent = useMemo(
    () => (agentRoadmaps || []).find((a: any) => a.personaId === activeAgentId) || agentRoadmaps?.[0] || null,
    [agentRoadmaps, activeAgentId],
  )

  const currentRoadmap = (activeAgent?.roadmap as any) || roadmap
  const weeks = currentRoadmap?.weeks || []

  const getResourceIcon = (type: string) => {
    const t = (type || '').toLowerCase()
    if (t.includes('video') || t.includes('youtube')) return <PlayCircle className="h-5 w-5 text-red-400" />
    if (t.includes('doc') || t.includes('article')) return <BookOpen className="h-5 w-5 text-blue-400" />
    if (t.includes('project') || t.includes('repo')) return <Code2 className="h-5 w-5 text-purple-400" />
    return <ExternalLink className="h-5 w-5 text-gray-400" />
  }

  const selectPersona = async (personaId: string) => {
    if (!roadmapId) return
    try {
      setError(null)
      setSelectedAgentId(personaId)
      const res = await selectAgentRoadmap(roadmapId, personaId)
      if (res?.final_roadmap) {
        setRoadmap(res.final_roadmap)
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to select agent roadmap.')
    }
  }

  const applyPrompt = async (text: string) => {
    if (!roadmapId || !activeAgentId || !text.trim()) {
      setError('Please enter a prompt.')
      return
    }
    setLoading(true)
    setError(null)
    try {
      const res = await refineRoadmap({ roadmapId, agentId: activeAgentId, prompt: text })
      if (res?.agent_roadmaps) setAgentRoadmaps(res.agent_roadmaps)
      if (res?.refined_roadmap) setRoadmap(res.refined_roadmap)
      setPrompt('')
    } catch (err: any) {
      setError(err?.message || 'Failed to refine roadmap.')
    } finally {
      setLoading(false)
    }
  }

  const quickPrompts = [
    'Reduce total duration by 25% but keep key milestones.',
    'Make it less overwhelming: fewer resources per week, clearer goals.',
    'Add more hands-on projects and GitHub repos.',
    'Include deeper theory/explanations for complex topics.',
  ]

  return (
    <div className="min-h-screen bg-[#0b0f1a] text-white selection:bg-cyan-500/30">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 right-0 h-[500px] w-[500px] bg-purple-900/20 blur-[120px]" />
        <div className="absolute bottom-0 left-0 h-[500px] w-[500px] bg-cyan-900/10 blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-4 py-8 md:px-12 md:py-12 space-y-8">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-cyan-400">Refine Your Roadmap</div>
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Choose & Adjust an Agentic Plan</h1>
            <p className="mt-2 text-sm text-slate-400">
              Pick one of the four agent variations, then apply custom prompts to tailor it.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="border-white/10 bg-white/5 text-xs" onClick={() => navigate('/roadmap')}>
              View Roadmap
            </Button>
            <Button className="bg-gradient-to-r from-cyan-600 to-blue-600 text-xs" onClick={() => navigate('/dashboard')}>
              Dashboard
            </Button>
          </div>
        </div>

        {error && (
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {error}
          </div>
        )}

        {/* Persona Tabs */}
        <div className="flex flex-wrap gap-3">
          {(agentRoadmaps || []).map((agent: any) => {
            const active = agent.personaId === activeAgentId
            return (
              <button
                key={agent.personaId}
                type="button"
                onClick={() => selectPersona(agent.personaId)}
                className={`flex items-center gap-3 rounded-xl border px-3 py-2 text-xs md:text-sm transition-all ${
                  active
                    ? 'border-cyan-500 bg-cyan-500/10 text-cyan-200 shadow-md shadow-cyan-500/20'
                    : 'border-white/10 bg-white/5 text-slate-300 hover:border-cyan-500/40 hover:bg-cyan-500/5'
                }`}
              >
                <div className="h-8 w-8 overflow-hidden rounded-lg bg-slate-900/80">
                  <img
                    src={`https://robohash.org/${encodeURIComponent(agent.personaName || agent.personaId)}.png?set=set1&size=200x200`}
                    alt={agent.personaName || agent.personaId}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="text-left">
                  <div className="font-semibold">{agent.personaName}</div>
                  <div className="text-[10px] text-slate-400">{personaLabel(agent.personaId)}</div>
                </div>
              </button>
            )
          })}
        </div>

        {/* Refinement form */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 md:p-6">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-white">
            <Wand2 className="h-4 w-4 text-cyan-400" /> Refine this roadmap
          </div>
          <div className="grid gap-3 md:grid-cols-4">
            <div className="md:col-span-3">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., Make this less overwhelming and reduce total duration to 8 weeks..."
                className="w-full rounded-lg border border-white/10 bg-black/40 p-3 text-sm text-white placeholder:text-slate-500 focus:border-cyan-500/60 focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
                rows={3}
              />
              <div className="mt-2 flex flex-wrap gap-2">
                {quickPrompts.map((qp) => (
                  <button
                    key={qp}
                    type="button"
                    onClick={() => setPrompt(qp)}
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] text-slate-300 hover:border-cyan-500/40 hover:text-cyan-200"
                  >
                    <Sparkles className="mr-1 inline h-3 w-3 text-cyan-400" />
                    {qp}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-end">
              <Button
                onClick={() => applyPrompt(prompt)}
                disabled={loading}
                className="w-full bg-gradient-to-r from-cyan-600 to-blue-600"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" /> Refining...
                  </span>
                ) : (
                  'Apply refinement'
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Weekly Timeline */}
        <div className="relative space-y-12 border-t border-white/5 pt-8 pl-4 md:pl-8 before:absolute before:left-2 md:before:left-3 before:top-2 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-cyan-500 before:to-transparent before:opacity-20">
          {(weeks.length ? weeks : Array.from({ length: selectedStrategy?.weeks || 4 }, (_: any, i: number) => ({ week: i + 1 }))).map(
            (week: any, idx: number) => (
              <div key={week.week ?? idx} className="relative scroll-mt-24">
                <div className="absolute -left-[35px] md:-left-[39px] top-1 flex h-6 w-6 items-center justify-center rounded-full bg-[#0b0f1a] border-2 border-cyan-500/50 shadow-[0_0_10px_rgba(6,182,212,0.5)] z-10">
                  <div className="h-2 w-2 rounded-full bg-cyan-400" />
                </div>

                <div className="mb-6">
                  <h2 className="text-sm font-bold uppercase tracking-widest text-cyan-400 mb-1">Week {week.week || idx + 1}</h2>
                  <h3 className="text-2xl md:text-3xl font-bold text-white">{week.focus || 'Core Concepts & Fundamentals'}</h3>
                </div>

                <div className="grid gap-8 lg:grid-cols-12">
                  <div className="lg:col-span-4 rounded-xl bg-white/[0.02] p-6 border border-white/5 h-fit">
                    <h4 className="mb-4 flex items-center gap-2 text-sm font-medium text-gray-400 uppercase">
                      <Target className="h-4 w-4" /> Objectives
                    </h4>
                    {week.goals ? (
                      <ul className="space-y-3">
                        {week.goals.map((g: string, i: number) => (
                          <li key={i} className="flex items-start gap-3 text-gray-300">
                            <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-cyan-500/70" />
                            <span className="text-sm leading-relaxed">{g}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-gray-500 italic">Objectives loading...</p>
                    )}
                  </div>

                  <div className="lg:col-span-8">
                    <h4 className="mb-4 text-sm font-medium text-gray-400 uppercase">Recommended Resources</h4>
                    <div className="grid gap-4 sm:grid-cols-2">
                      {(week.resources || []).map((r: any, i: number) => (
                        <a
                          key={`${r.title}-${i}`}
                          href={r.url}
                          target="_blank"
                          rel="noreferrer"
                          className="group relative flex flex-col justify-between rounded-xl border border-white/10 bg-[#111620] p-5 transition-all hover:bg-[#161b26] hover:border-cyan-500/30 hover:shadow-lg hover:shadow-cyan-500/5 hover:-translate-y-1"
                        >
                          <div>
                            <div className="mb-3 flex items-start justify-between">
                              <div className="rounded-lg bg-black/40 p-2.5 transition-colors group-hover:bg-cyan-500/20 group-hover:text-cyan-300 border border-white/5">
                                {getResourceIcon(r.type)}
                              </div>
                              <ExternalLink className="h-4 w-4 text-gray-600 group-hover:text-gray-400" />
                            </div>

                            <div className="mb-2">
                              <span className="inline-block rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-gray-500 bg-white/5 group-hover:text-cyan-400">
                                {r.type}
                              </span>
                            </div>

                            <h5 className="mb-2 text-lg font-semibold text-gray-200 group-hover:text-white line-clamp-2">
                              {r.title}
                            </h5>
                          </div>

                          <p className="text-xs leading-relaxed text-gray-400 line-clamp-2 mt-2">
                            {r.summary || 'AI-curated resource tailored to your profile.'}
                          </p>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ),
          )}
        </div>
      </div>
    </div>
  )
}

