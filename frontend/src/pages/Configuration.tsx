import { useState, type KeyboardEvent } from 'react'
import {
  Cpu,
  Activity,
  Wallet,
  Clock,
  Monitor,
  Wrench,
  FolderGit2,
  Terminal,
  Calendar,
  Plus,
  X,
  ChevronRight,
  Sparkles,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { PageContainer, SectionHeader, Card } from '@/components/shared'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useRoadmap } from '@/context/RoadmapContext'
import { draftStrategies } from '@/lib/api'
import { useAuthStore } from '@/store/authStore'

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
          <span key={tag} className="inline-flex items-center gap-1 rounded-md bg-cyan-950/40 border border-cyan-500/30 px-2 py-1 text-xs font-medium text-cyan-300">
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
  className = '',
}: {
  label: string
  icon: any
  children: React.ReactNode
  className?: string
}) => (
  <Card className={`flex flex-col gap-3 ${className}`}>
    <div className="flex items-center gap-2 text-slate-400">
      <Icon className="h-4 w-4" />
      <span className="text-xs font-bold uppercase tracking-wider">{label}</span>
    </div>
    <div>{children}</div>
  </Card>
)

export default function Configuration() {
  const navigate = useNavigate()
  const { setConfig, setStrategies, setRoadmapId } = useRoadmap()
  const { user } = useAuthStore()
  
  const [topic, setTopic] = useState('')
  const [level, setLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Beginner')
  const [style, setStyle] = useState<string[]>(['Interactive'])
  const [hours, setHours] = useState<number[]>([20])
  const [targetWeeks, setTargetWeeks] = useState<number>(12)
  const [goalAlignment, setGoalAlignment] = useState('')
  const [budget, setBudget] = useState('')
  const [deviceSpecs, setDeviceSpecs] = useState('')
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
        targetWeeks,
        goalAlignment,
        budget,
        deviceSpecs,
        preferredTools: preferredTools.join(', '),
        projectType,
        language: topic,
        deadline,
        userId: user?.id,
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
    <div className="text-slate-200">
      <PageContainer maxWidth="5xl" padding="lg">
        <SectionHeader
          align="center"
          eyebrow="System Configuration v2.0"
          title={
            <>
              Define Your{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
                Mission Parameters
              </span>
            </>
          }
          subtitle="Fill in the details below. The more precise your inputs, the more accurate the Agentic Roadmap will be."
        />

        <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-8">
            <Card className="border-cyan-500/30 bg-gradient-to-b from-cyan-950/20 to-transparent">
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
            </Card>

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
                        className={`rounded-full border px-3 py-1 text-xs font-medium transition-all ${
                          style.includes(s)
                            ? 'border-cyan-500/60 bg-cyan-500/10 text-cyan-200'
                            : 'border-white/10 bg-white/5 text-slate-300 hover:border-cyan-500/40 hover:text-cyan-200'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </ConfigCard>
              </div>
            </div>

            <div>
              <SectionHeader title="Time & Budget" subtitle="Constraints for planning." />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ConfigCard label="Weekly Hours" icon={Clock}>
                  <Input
                    type="number"
                    min={1}
                    max={80}
                    value={hours[0]}
                    onChange={(e) => setHours([Number(e.target.value)])}
                    className="border-white/10 bg-black/20 focus:border-cyan-500/50"
                  />
                </ConfigCard>
                <ConfigCard label="Target Weeks" icon={Calendar}>
                  <Input
                    type="number"
                    min={1}
                    max={52}
                    value={targetWeeks}
                    onChange={(e) => setTargetWeeks(Number(e.target.value))}
                    className="border-white/10 bg-black/20 focus:border-cyan-500/50"
                  />
                </ConfigCard>
                <ConfigCard label="Budget" icon={Wallet}>
                  <Input
                    placeholder="e.g. $0, $200"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="border-white/10 bg-black/20 focus:border-cyan-500/50"
                  />
                </ConfigCard>
                <ConfigCard label="Deadline" icon={Calendar}>
                  <Input
                    placeholder="Optional deadline"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="border-white/10 bg-black/20 focus:border-cyan-500/50"
                  />
                </ConfigCard>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <ConfigCard label="Hardware / Device" icon={Monitor}>
              <Input
                placeholder="e.g. M1 Air, 16GB RAM"
                value={deviceSpecs}
                onChange={(e) => setDeviceSpecs(e.target.value)}
                className="border-white/10 bg-black/20 focus:border-cyan-500/50"
              />
            </ConfigCard>

            <ConfigCard label="Hours & Schedule" icon={Clock}>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2 text-slate-400">
                  <Cpu className="h-4 w-4 text-cyan-400" />
                  <span>{hours[0]} hrs/week target</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <Calendar className="h-4 w-4 text-purple-400" />
                  <span>{targetWeeks} weeks total</span>
                </div>
              </div>
            </ConfigCard>

            <ConfigCard label="Deployment Target" icon={FolderGit2}>
              <Input
                placeholder="e.g. GitHub repo or production"
                className="border-white/10 bg-black/20 focus:border-cyan-500/50"
              />
            </ConfigCard>

            <ConfigCard label="Constraints Overview" icon={Cpu}>
              <p className="text-sm text-slate-400">
                We will tailor recommendations to your device and budget, preferring lightweight tools where necessary.
              </p>
            </ConfigCard>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center gap-4">
          <Button
            size="lg"
            className="h-12 w-full max-w-md bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-semibold shadow-cyan-500/30 hover:from-cyan-500 hover:to-blue-500"
            onClick={handleDraft}
            disabled={loading}
          >
            {loading ? 'Generating strategies...' : 'Generate Strategies'}
          </Button>
          {error && <p className="text-xs text-red-400">{error}</p>}
          <p className="text-[10px] uppercase tracking-widest text-slate-500 flex items-center gap-2">
            <ChevronRight className="h-3 w-3" />
            <span>Data is stored securely for your session.</span>
          </p>
        </div>
      </PageContainer>
    </div>
  )
}
