import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Pencil,
  CheckCircle2,
  PlayCircle,
  BookOpen,
  Code2,
  ExternalLink,
  Map as MapIcon,
  Target,
  FileText,
} from 'lucide-react'

import { PageContainer, Card } from '@/components/shared'
import { Button } from '@/components/ui/button'
import { RoadmapHeader } from '@/components/roadmap'
import { RoadmapFlow } from '@/components/RoadmapFlow'
import { useRoadmap } from '@/context/RoadmapContext'

export default function Roadmap() {
  const navigate = useNavigate()
  const {
    selectedStrategy,
    sandboxId,
    roadmap,
    config,
    agentRoadmaps,
    selectedAgentId,
    setRoadmap,
    setSelectedAgentId,
    roadmapId,
  } = useRoadmap()
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!selectedStrategy) {
      navigate('/start')
    }
  }, [selectedStrategy, navigate])

  const activeAgentId = selectedAgentId || (agentRoadmaps?.[0]?.personaId as string | undefined) || null

  const activeAgent = useMemo(
    () => (agentRoadmaps || []).find((a: any) => a.personaId === activeAgentId) || agentRoadmaps?.[0] || null,
    [agentRoadmaps, activeAgentId],
  )

  const currentRoadmap = (activeAgent?.roadmap as any) || roadmap
  const weeks = currentRoadmap?.weeks || []
  const resourceCount = (weeks || []).reduce(
    (count: number, w: any) => count + ((w.resources as any[])?.length || 0),
    0,
  )

  const handlePersonaClick = (personaId: string, agent: any) => {
    setSelectedAgentId(personaId)
    if (agent?.roadmap) {
      setRoadmap(agent.roadmap)
    }
  }

  const handleShare = async () => {
    if (!roadmapId || typeof window === 'undefined') return
    const url = `${window.location.origin}/roadmap/${roadmapId}`
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  const getResourceIcon = (type?: string) => {
    const t = (type || '').toLowerCase()
    if (t.includes('video') || t.includes('youtube')) return <PlayCircle className="h-5 w-5 text-red-400" />
    if (t.includes('doc') || t.includes('article')) return <BookOpen className="h-5 w-5 text-blue-400" />
    if (t.includes('project') || t.includes('repo')) return <Code2 className="h-5 w-5 text-purple-400" />
    return <ExternalLink className="h-5 w-5 text-gray-400" />
  }

  const fallbackResources = [
    { type: 'video', title: 'Introduction & Overview', url: '#', summary: 'Core concepts overview.' },
    { type: 'article', title: 'Official Documentation', url: '#', summary: 'Primary reference guide.' }
  ]

  return (
    <div className="text-slate-200">
      <PageContainer maxWidth="6xl" padding="md">
        <div className="mb-10">
          <RoadmapHeader
            goal={config?.goalAlignment}
            title={currentRoadmap?.title || selectedStrategy?.name || 'Your Learning Path'}
            summary={
              currentRoadmap?.summary ||
              'A personalized curriculum designed to take you from concept to mastery, tailored to your hardware and schedule.'
            }
            weeks={config?.targetWeeks || currentRoadmap?.weeks?.length || selectedStrategy?.weeks || 4}
            level={config?.level}
            hoursPerWeek={config?.hours}
            budget={config?.budget}
            deadline={config?.deadline}
            style={config?.style}
            projectType={config?.projectType}
            preferredTools={config?.preferredTools}
            resourceCount={resourceCount}
            sandboxId={sandboxId}
            showShare
            onShare={roadmapId ? handleShare : null}
            shareCopied={copied}
          />
        </div>

        {/* Persona Tabs */}
        {agentRoadmaps && agentRoadmaps.length > 0 && (
          <div className="mb-10 flex flex-wrap gap-3">
            {agentRoadmaps.map((agent: any) => {
              const active = agent.personaId === activeAgentId
              return (
                <button
                  key={agent.personaId}
                  type="button"
                  onClick={() => handlePersonaClick(agent.personaId, agent)}
                  className={`flex items-center gap-3 rounded-xl border px-3 py-2 text-xs md:text-sm transition-all ${
                    active
                      ? 'border-cyan-500 bg-cyan-500/10 text-cyan-200 shadow-md shadow-cyan-500/20'
                      : 'border-white/10 bg-white/5 text-slate-300 hover:border-cyan-500/40 hover:bg-cyan-500/5'
                  }`}
                >
                  <div className="h-8 w-8 overflow-hidden rounded-lg bg-slate-900/80">
                    {/* Generic persona image via public source */}
                    <img
  src={`https://robohash.org/${encodeURIComponent(agent.personaName || agent.personaId)}.png?set=set1&size=200x200`}
  alt={agent.personaName || agent.personaId}
  className="h-full w-full object-cover"
  loading="lazy"
/>

                  </div>
                  <div className="text-left">
                    <div className="font-semibold">{agent.personaName}</div>
                    <div className="text-[10px] text-slate-400">
                      {agent.personaId === 'systems-architect' && 'Structured, fundamentals-first roadmap.'}
                      {agent.personaId === 'project-hacker' && 'Project-heavy, build-first roadmap.'}
                      {agent.personaId === 'research-mentor' && 'Deep theory & high-signal explainers.'}
                      {agent.personaId === 'constraints-optimizer' && 'Optimized for time, budget & hardware.'}
                      {!['systems-architect', 'project-hacker', 'research-mentor', 'constraints-optimizer'].includes(
                        agent.personaId,
                      ) && 'Alternative agentic route.'}
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        )}

        {/* --- FULLSCREEN CAPABLE FLOW CHART --- */}
        <div className="mb-16">
          <div className="mb-4 flex items-center gap-2 text-sm font-semibold tracking-widest text-gray-400 uppercase">
            <MapIcon className="h-4 w-4" /> Curriculum Map
          </div>
          <Card className="p-0 overflow-hidden">
            <RoadmapFlow
              title={currentRoadmap?.title || selectedStrategy?.name || 'Roadmap'}
              weeks={weeks}
            />
          </Card>
        </div>

        {/* Weekly Timeline */}
        <div className="relative space-y-16 pl-4 md:pl-8 before:absolute before:left-2 md:before:left-3 before:top-2 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-cyan-500 before:to-transparent before:opacity-20">
          {(weeks.length ? weeks : Array.from({ length: selectedStrategy?.weeks || 4 }, (_, i) => ({ week: i + 1 }))).map(
            (week: any, idx: number) => (
              <div key={week.week ?? idx} id={`week-${idx + 1}`} className="relative scroll-mt-24">
                
                {/* Timeline Dot */}
                <div className="absolute -left-[35px] md:-left-[39px] top-1 flex h-6 w-6 items-center justify-center rounded-full bg-[#0b0f1a] border-2 border-cyan-500/50 shadow-[0_0_10px_rgba(6,182,212,0.5)] z-10">
                  <div className="h-2 w-2 rounded-full bg-cyan-400" />
                </div>

                {/* Week Header */}
                <div className="mb-8">
                  <h2 className="text-sm font-bold uppercase tracking-widest text-cyan-400 mb-2">
                    Week {week.week || idx + 1}
                  </h2>
                  <h3 className="text-2xl md:text-3xl font-bold text-white">
                    {week.focus || "Core Concepts & Fundamentals"}
                  </h3>
                </div>

                {/* Grid Layout */}
                <div className="grid gap-8 lg:grid-cols-12">
                  {/* Goals Column (Left - 4 cols) */}
                  <Card className="lg:col-span-4 h-fit">
                    <h4 className="mb-4 flex items-center gap-2 text-sm font-medium text-gray-400 uppercase">
                      <Target className="h-4 w-4" /> Objectives
                    </h4>
                    {week.goals ? (
                      <ul className="space-y-4">
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
                  </Card>

                  {/* Resources Column (Right - 8 cols) */}
                  <div className="lg:col-span-8">
                    <h4 className="mb-4 text-sm font-medium text-gray-400 uppercase">Recommended Resources</h4>
                    <div className="grid gap-4 sm:grid-cols-2">
                      {(week.resources || fallbackResources).map((r: any, i: number) => (
                        <Card
                          key={`${r.title}-${i}`}
                          hover
                          padding="md"
                          className="group relative flex flex-col justify-between bg-[#111620]"
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
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )
          )}
        </div>

        {/* Resume CTA */}
        <Card className="mt-16 flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-cyan-500/20 bg-cyan-500/5">
          <div>
            <p className="text-xs uppercase tracking-widest text-cyan-300 font-semibold flex items-center gap-2">
              <FileText className="h-4 w-4" /> Tailor Your Resume
            </p>
            <h3 className="text-xl font-bold text-white mt-2">Finish strong with a tailored resume</h3>
            <p className="text-sm text-slate-300 mt-1">
              Upload your resume and generate a role-ready version plus job matches.
            </p>
          </div>
          <Button
            size="lg"
            className="bg-cyan-600 hover:bg-cyan-500 text-white font-semibold"
            onClick={() => navigate('/dashboard?tab=resume')}
          >
            Go to Resume Workspace
          </Button>
        </Card>

        {/* Floating Action Button */}
        <Button
          className="fixed bottom-8 right-8 h-14 w-14 rounded-full bg-cyan-600 shadow-xl shadow-cyan-500/20 hover:bg-cyan-500 hover:scale-105 hover:rotate-3 transition-all z-40 border border-cyan-400/20"
          title="Edit Roadmap (Coming Soon)"
        >
          <Pencil className="h-6 w-6" />
        </Button>
      </PageContainer>
    </div>
  )
}
