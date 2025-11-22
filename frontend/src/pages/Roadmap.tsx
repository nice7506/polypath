import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Pencil,
  CheckCircle2,
  PlayCircle,
  BookOpen,
  Code2,
  ExternalLink,
  Calendar,
  Cpu,
  ShieldCheck,
  Map as MapIcon,
  Target,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { RoadmapFlow } from '@/components/RoadmapFlow' // Ensure this imports the new file above
import { useRoadmap } from '@/context/RoadmapContext'

export default function Roadmap() {
  const navigate = useNavigate()
  const { selectedStrategy, sandboxId, roadmap, config } = useRoadmap()

  useEffect(() => {
    if (!selectedStrategy) {
      navigate('/start')
    }
  }, [selectedStrategy, navigate])

  const weeks = roadmap?.weeks || []
  
  const getResourceIcon = (type: string) => {
    const t = type.toLowerCase()
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
    <div className="min-h-screen bg-[#0b0f1a] text-white selection:bg-cyan-500/30">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 right-0 h-[500px] w-[500px] bg-purple-900/20 blur-[120px]" />
        <div className="absolute bottom-0 left-0 h-[500px] w-[500px] bg-cyan-900/10 blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-4 py-8 md:px-12 md:py-12">
        
        {/* Header Section */}
        <div className="mb-12 space-y-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-400 border border-cyan-500/20">
                  {config?.goalAlignment || "Skill Acquisition"}
                </span>
                {sandboxId && (
                  <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400 border border-emerald-500/20">
                    <ShieldCheck className="h-3 w-3" /> Sandbox Active
                  </span>
                )}
              </div>
              <h1 className="text-3xl font-bold tracking-tight md:text-5xl text-white">
                {roadmap?.title || selectedStrategy?.name || 'Your Learning Path'}
              </h1>
              <p className="mt-4 max-w-2xl text-base md:text-lg text-gray-400 leading-relaxed">
                {roadmap?.summary || "A personalized curriculum designed to take you from concept to mastery, tailored to your hardware and schedule."}
              </p>
            </div>
            
            <div className="flex gap-4 rounded-xl bg-white/5 p-4 border border-white/10 md:flex-col md:items-end md:gap-2 md:bg-transparent md:border-0 md:p-0">
               <div className="flex items-center gap-2 text-sm text-gray-300 md:text-gray-400">
                  <Calendar className="h-4 w-4 text-cyan-400" />
                  <span>{selectedStrategy?.weeks || 4} Weeks</span>
               </div>
               <div className="flex items-center gap-2 text-sm text-gray-300 md:text-gray-400">
                  <Cpu className="h-4 w-4 text-purple-400" />
                  <span>{config?.level || "Intermediate"}</span>
               </div>
            </div>
          </div>
        </div>

        {/* --- FULLSCREEN CAPABLE FLOW CHART --- */}
        <div className="mb-16">
            <div className="mb-4 flex items-center gap-2 text-sm font-semibold tracking-widest text-gray-400 uppercase">
                <MapIcon className="h-4 w-4" /> Curriculum Map
            </div>
            {/* We just render the component; it handles its own styling/fullscreen */}
            <div className="rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
                <RoadmapFlow 
                    title={roadmap?.title || selectedStrategy?.name || 'Roadmap'} 
                    weeks={weeks} 
                />
            </div>
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
                  <div className="lg:col-span-4 rounded-xl bg-white/[0.02] p-6 border border-white/5 h-fit">
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
                  </div>

                  {/* Resources Column (Right - 8 cols) */}
                  <div className="lg:col-span-8">
                    <h4 className="mb-4 text-sm font-medium text-gray-400 uppercase">Recommended Resources</h4>
                    <div className="grid gap-4 sm:grid-cols-2">
                      {(week.resources || fallbackResources).map((r: any, i: number) => (
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
            )
          )}
        </div>

        {/* Floating Action Button */}
        <Button 
          className="fixed bottom-8 right-8 h-14 w-14 rounded-full bg-cyan-600 shadow-xl shadow-cyan-500/20 hover:bg-cyan-500 hover:scale-105 hover:rotate-3 transition-all z-40 border border-cyan-400/20"
          title="Edit Roadmap (Coming Soon)"
        >
          <Pencil className="h-6 w-6" />
        </Button>

      </div>
    </div>
  )
}
