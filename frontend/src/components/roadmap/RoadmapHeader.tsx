import { Button } from '@/components/ui/button'
import { SectionHeader, StatPill } from '@/components/shared'
import {
  Calendar,
  CalendarClock,
  Clock,
  Cpu,
  ShieldCheck,
  Share2,
  Target,
  Wallet,
  Wrench,
  BookOpen,
} from 'lucide-react'

type RoadmapHeaderProps = {
  title: string
  summary?: string
  goal?: string
  weeks?: number
  level?: string
  hoursPerWeek?: number
  budget?: string
  style?: string
  projectType?: string
  deadline?: string
  preferredTools?: string
  resourceCount?: number
  sandboxId?: string | null
  onShare?: (() => void) | null
  shareCopied?: boolean
  showShare?: boolean
}

export const RoadmapHeader = ({
  title,
  summary,
  goal,
  weeks,
  level,
  hoursPerWeek,
  budget,
  style,
  projectType,
  deadline,
  preferredTools,
  resourceCount,
  sandboxId,
  onShare,
  shareCopied,
  showShare = false,
}: RoadmapHeaderProps) => {
  const tools = (preferredTools || '')
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean)
    .slice(0, 5)

  return (
    <div className="space-y-4">
      <SectionHeader
        eyebrow={goal || 'Skill Acquisition'}
        title={title}
        subtitle={
          summary ||
          'A personalized curriculum designed to take you from concept to mastery, tailored to your hardware and schedule.'
        }
        actions={
          <div className="flex flex-wrap items-center gap-3">
            {sandboxId && (
              <StatPill tone="emerald">
                <ShieldCheck className="h-3 w-3" /> Sandbox Active
              </StatPill>
            )}
            <StatPill tone="cyan">
              <Calendar className="h-4 w-4" />
              {weeks || '—'} Weeks
            </StatPill>
            <StatPill tone="purple">
              <Cpu className="h-4 w-4" />
              {level || 'Intermediate'}
            </StatPill>
            {typeof hoursPerWeek === 'number' && (
              <StatPill tone="neutral">
                <Clock className="h-4 w-4" />
                {hoursPerWeek}h/week
              </StatPill>
            )}
            {budget && (
              <StatPill tone="neutral">
                <Wallet className="h-4 w-4" />
                {budget}
              </StatPill>
            )}
            {showShare && onShare && (
              <Button
                variant="outline"
                size="sm"
                className="mt-3 inline-flex items-center gap-2 rounded-md border border-cyan-500/40 bg-cyan-500/10 px-3 py-2 text-[11px] font-semibold text-cyan-200 hover:bg-cyan-500/20 hover:text-white transition"
                onClick={onShare}
              >
                <Share2 className="h-4 w-4 mr-2" />
                {shareCopied ? 'Link copied!' : 'Share roadmap'}
              </Button>
            )}
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <div className="mb-2 flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-slate-400">
            <Target className="h-3.5 w-3.5 text-cyan-400" /> Mission Brief
          </div>
          <p className="text-sm text-slate-200">
            {goal || 'Skill Acquisition'} {projectType ? `· ${projectType}` : ''}
          </p>
          {summary && <p className="mt-2 text-xs text-slate-500 line-clamp-2">{summary}</p>}
        </div>

        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <div className="mb-2 flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-slate-400">
            <CalendarClock className="h-3.5 w-3.5 text-purple-400" /> Timing & Constraints
          </div>
          <div className="flex flex-wrap gap-3 text-[13px] text-slate-300">
            <span className="inline-flex items-center gap-2 rounded-lg bg-white/5 px-2.5 py-1">
              <Calendar className="h-4 w-4 text-cyan-400" />
              {weeks || '—'} week plan
            </span>
            {typeof hoursPerWeek === 'number' && (
              <span className="inline-flex items-center gap-2 rounded-lg bg-white/5 px-2.5 py-1">
                <Clock className="h-4 w-4 text-emerald-400" />
                {hoursPerWeek}h/week
              </span>
            )}
            {deadline && (
              <span className="inline-flex items-center gap-2 rounded-lg bg-white/5 px-2.5 py-1">
                <CalendarClock className="h-4 w-4 text-amber-400" />
                {deadline}
              </span>
            )}
            {budget && (
              <span className="inline-flex items-center gap-2 rounded-lg bg-white/5 px-2.5 py-1">
                <Wallet className="h-4 w-4 text-pink-400" />
                {budget}
              </span>
            )}
            {typeof resourceCount === 'number' && (
              <span className="inline-flex items-center gap-2 rounded-lg bg-white/5 px-2.5 py-1">
                <BookOpen className="h-4 w-4 text-indigo-400" />
                {resourceCount} curated resources
              </span>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <div className="mb-2 flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-slate-400">
            <Wrench className="h-3.5 w-3.5 text-emerald-400" /> Stack & Style
          </div>
          <div className="flex flex-wrap gap-2">
            {style && (
              <span className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1 text-[11px] font-semibold text-purple-100">
                {style}
              </span>
            )}
            {tools.length > 0 ? (
              tools.map((tool) => (
                <span
                  key={tool}
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold text-slate-200"
                >
                  {tool}
                </span>
              ))
            ) : (
              <span className="text-xs text-slate-500">No preferred tools noted.</span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
