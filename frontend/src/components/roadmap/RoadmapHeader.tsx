import { Button } from '@/components/ui/button'
import { SectionHeader, StatPill } from '@/components/shared'
import { Calendar, Cpu, ShieldCheck, Share2 } from 'lucide-react'

type RoadmapHeaderProps = {
  title: string
  summary?: string
  goal?: string
  weeks?: number
  level?: string
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
  sandboxId,
  onShare,
  shareCopied,
  showShare = false,
}: RoadmapHeaderProps) => {
  return (
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
  )
}
