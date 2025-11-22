import { useState, type KeyboardEvent } from 'react'
import { Cpu, Activity, Wallet, Clock, Monitor, Wrench, FolderGit2, Terminal, Calendar, Plus, X, ChevronRight, Sparkles } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Slider } from '@/components/ui/slider'
import { useRoadmap } from '@/context/RoadmapContext'
import { draftStrategies } from '@/lib/api'

// --- ASSETS & STYLES ---
const bgNoise = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E")`

// --- COMPONENTS ---

const SectionHeader = ({ title, subtitle }: { title: string; subtitle: string }) => (
  <div className="mb-6 border-b border-white/10 pb-2">
    <h3 className="text-lg font-bold text-white flex items-center gap-2">
      <div className="h-1.5 w-1.5 rounded-full bg-cyan-500" />
      {title}
    </h3>
    <p className="text-xs text-slate-400 ml-3.5">{subtitle}</p>
  </div>
)

const TagInput = ({ tags, setTags, placeholder }: { tags: string[]; setTags: (t: string[]) => void; placeholder: string }) => {
  const [input, setInput] = useState('')

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && input.trim()) {
      e.preventDefault()
      if (!tags.includes(input.trim())) {
        setTags([...tags, input.trim()])
      }
      setInput('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  return (
    <div className="space-y-3">
      <div className="relative">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="h-10 border-white/10 bg-black/20 text-sm focus:border-cyan-500/50 focus:ring-cyan-500/20 placeholder:text-slate-600 pr-10"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
           <Plus className="h-4 w-4 text-slate-500" />
        </div>
      </div>
      <div className="flex flex-wrap gap-2 min-h-[32px]">
        {tags.length === 0 && <span className="text-xs text-slate-600 italic pt-1">No tools added yet...</span>}
        {tags.map((tag) => (
          <span key={tag} className="inline-flex items-center gap-1 rounded-md bg-cyan-950/40 border border-cyan-500/30 px-2 py-1 text-xs font-medium text-cyan-300 animate-in fade-in zoom-in duration-200">
            {tag}
            <button onClick={() => removeTag(tag)} type="button" className="hover:text-white transition-colors">
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
      </div>
    </div>
  )
}

const ConfigCard = ({ 
  label, 
  icon: Icon, 
  children,
  className = "" 
}: { 
  label: string, 
  icon: any, 
  children: React.ReactNode,
  className?: string
}) => (
  <div className={`group relative flex flex-col gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-5 transition-all duration-300 hover:bg-white/[0.04] hover:border-white/10 ${className}`}>
    <div className="flex items-center gap-2 text-slate-400 group-hover:text-cyan-400 transition-colors">
      <Icon className="h-4 w-4" />
      <span className="text-xs font-bold uppercase tracking-wider">{label}</span>
    </div>
    <div className="relative z-10">
      {children}
    </div>
  </div>
)

// --- MAIN COMPONENT ---

export default function Configuration() {
  const navigate = useNavigate()
  const { setConfig, setStrategies, setRoadmapId } = useRoadmap()
  
  // State
  const [topic, setTopic] = useState('')
  const [level, setLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Beginner')
  const [style, setStyle] = useState<string[]>(['Interactive'])
  const [hours, setHours] = useState<number[]>([20])
  const [goalAlignment, setGoalAlignment] = useState('')
  const [budget, setBudget] = useState('')
  const [deviceSpecs, setDeviceSpecs] = useState('')
  
  // Changed to array for better UX
  const [preferredTools, setPreferredTools] = useState<string[]>([]) 
  
  const [projectType, setProjectType] = useState('')
  const [deadline, setDeadline] = useState('')
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDraft = async () => {
    if (!topic) {
      setError("Please enter a main topic to start.")
      return
    }

    setError(null)
    setLoading(true)
    try {
      const payload = {
        topic,
        level,
        style: style.join(', '),
        hours: hours[0],
        goalAlignment,
        budget,
        deviceSpecs,
        preferredTools: preferredTools.join(', '),
        projectType,
        language: topic, // Defaulting language to topic if not specified separately
        deadline,
      }
      const data = await draftStrategies(payload)
      setConfig(payload)
      setStrategies(data.strategies || [])
      setRoadmapId(data.roadmapId || null)
      navigate('/select')
    } catch (err: any) {
      setError(err.message || 'Failed to generate strategies')
    } finally {
      setLoading(false)
    }
  }

  const toggleStyle = (s: string) => {
    setStyle((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]))
  }

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans selection:bg-cyan-500/30 relative overflow-x-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none z-0" style={{ backgroundImage: bgNoise }}></div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-purple-900/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-cyan-900/10 rounded-full blur-[120px] pointer-events-none"></div>
      
      <div className="relative z-10 container mx-auto px-4 py-12 max-w-5xl">
        
        {/* Header */}
        <div className="mb-12 text-center space-y-4">
          <div className="inline-block">
            <span className="px-3 py-1 rounded-full border border-white/10 bg-white/5 text-[10px] font-mono text-slate-400 uppercase tracking-widest">
              System Configuration v2.0
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
            Define Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">Mission Parameters</span>
          </h1>
          <p className="text-slate-400 max-w-lg mx-auto text-sm md:text-base">
            Fill in the details below. The more precise your inputs, the more accurate the Agentic Roadmap will be.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* --- LEFT COLUMN: THE CORE OBJECTIVE (Span 2) --- */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Hero Input: Topic */}
            <div className="rounded-2xl border border-cyan-500/30 bg-gradient-to-b from-cyan-950/20 to-transparent p-6 md:p-8 shadow-[0_0_40px_rgba(8,145,178,0.1)]">
              <label className="block text-xs font-bold text-cyan-400 uppercase tracking-wider mb-3">
                <Sparkles className="inline-block w-3 h-3 mr-1" /> 
                Primary Mission / Topic
              </label>
              <Input
                placeholder="e.g. Full Stack Rust Development"
                className="h-14 text-lg md:text-xl border-white/10 bg-black/40 focus:border-cyan-500 focus:ring-cyan-500/20 placeholder:text-slate-600 transition-all"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
              <p className="mt-3 text-xs text-slate-500">This is the main subject you want to master.</p>
            </div>

            {/* Section 1: Goals & Context */}
            <div>
              <SectionHeader title="Mission Context" subtitle="What are you building and why?" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                <ConfigCard label="Goal Alignment" icon={Activity}>
                  <Input
                    placeholder="e.g. Land a Senior Role"
                    className="border-white/10 bg-black/20 focus:border-cyan-500/50"
                    value={goalAlignment}
                    onChange={(e) => setGoalAlignment(e.target.value)}
                  />
                </ConfigCard>

                <ConfigCard label="Project Output" icon={FolderGit2}>
                  <Input
                    placeholder="e.g. SaaS Platform"
                    className="border-white/10 bg-black/20 focus:border-cyan-500/50"
                    value={projectType}
                    onChange={(e) => setProjectType(e.target.value)}
                  />
                </ConfigCard>

                <ConfigCard label="Current Skill Level" icon={Terminal} className="md:col-span-2">
                   <div className="grid grid-cols-3 gap-2">
                    {(['Beginner', 'Intermediate', 'Advanced'] as const).map((l) => (
                      <button
                        key={l}
                        type="button"
                        onClick={() => setLevel(l)}
                        className={`rounded-lg text-xs font-bold py-3 border transition-all duration-200 ${
                          level === l 
                            ? 'bg-white text-black border-white shadow-lg' 
                            : 'bg-black/20 border-white/5 text-slate-500 hover:bg-white/5 hover:text-slate-300'
                        }`}
                      >
                        {l}
                      </button>
                    ))}
                   </div>
                </ConfigCard>
              </div>
            </div>

            {/* Section 2: Tech Stack */}
            <div>
              <SectionHeader title="Technical Environment" subtitle="Tools and preferences." />
              <div className="grid grid-cols-1 gap-4">
                 <ConfigCard label="Tech Stack / Preferred Tools" icon={Wrench}>
                    <TagInput 
                      tags={preferredTools} 
                      setTags={setPreferredTools} 
                      placeholder="Type tool name (e.g. Docker) and press Enter..." 
                    />
                 </ConfigCard>

                 <ConfigCard label="Learning Style" icon={Monitor}>
                    <div className="flex flex-wrap gap-2">
                      {['Video Course', 'Documentation', 'Interactive', 'Project-Based'].map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => toggleStyle(s)}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                            style.includes(s)
                              ? 'bg-purple-500/20 border-purple-500 text-purple-300'
                              : 'bg-transparent border-slate-700 text-slate-400 hover:border-slate-500'
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                 </ConfigCard>
              </div>
            </div>

          </div>

          {/* --- RIGHT COLUMN: LOGISTICS (Span 1) --- */}
          <div className="space-y-8">
             
             {/* Logistics Panel */}
             <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6 h-full">
                <SectionHeader title="Logistics" subtitle="Constraints & Hardware." />
                
                <div className="space-y-6">
                  {/* Time */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-xs">
                       <span className="text-slate-400 flex items-center gap-1"><Clock className="w-3 h-3"/> Time/Week</span>
                       <span className="text-cyan-400 font-mono bg-cyan-950/30 px-2 py-0.5 rounded border border-cyan-500/20">{hours[0]}h</span>
                    </div>
                    <Slider 
                      defaultValue={hours} 
                      onValueChange={setHours} 
                      max={60} 
                      step={5} 
                      className="py-2"
                    />
                  </div>

                  {/* Budget */}
                  <div className="space-y-2">
                     <label className="text-xs text-slate-400 flex items-center gap-1"><Wallet className="w-3 h-3"/> Budget</label>
                     <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">$</span>
                        <Input
                          placeholder="0-100/mo"
                          className="pl-6 border-white/10 bg-black/20 text-sm"
                          value={budget}
                          onChange={(e) => setBudget(e.target.value)}
                        />
                     </div>
                  </div>

                  {/* Deadline */}
                  <div className="space-y-2">
                     <label className="text-xs text-slate-400 flex items-center gap-1"><Calendar className="w-3 h-3"/> Deadline</label>
                     <Input
                        placeholder="e.g. 3 Months"
                        className="border-white/10 bg-black/20 text-sm"
                        value={deadline}
                        onChange={(e) => setDeadline(e.target.value)}
                      />
                  </div>

                  {/* Device */}
                  <div className="space-y-2">
                     <label className="text-xs text-slate-400 flex items-center gap-1"><Cpu className="w-3 h-3"/> Hardware</label>
                     <Input
                        placeholder="e.g. M1 Mac 16GB"
                        className="border-white/10 bg-black/20 text-sm"
                        value={deviceSpecs}
                        onChange={(e) => setDeviceSpecs(e.target.value)}
                      />
                  </div>
                </div>
             </div>

             {/* Submit Action */}
             <div className="sticky top-6">
               {error && (
                  <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center">
                    {error}
                  </div>
               )}
               <Button
                  onClick={handleDraft}
                  disabled={loading}
                  className="w-full h-14 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-lg shadow-lg shadow-cyan-500/20 transition-all hover:scale-[1.02] hover:shadow-cyan-500/40 disabled:opacity-50 disabled:hover:scale-100"
                >
                  {loading ? (
                     <span className="flex items-center gap-2">
                       <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                       Processing...
                     </span>
                  ) : (
                     <span className="flex items-center gap-2">
                       Generate Roadmap <ChevronRight className="w-5 h-5" />
                     </span>
                  )}
               </Button>
               <p className="mt-4 text-center text-[10px] text-slate-600 font-mono">
                  EST. GENERATION TIME: 15-30 SECONDS
               </p>
             </div>

          </div>
        </div>
      </div>
    </div>
  )
}