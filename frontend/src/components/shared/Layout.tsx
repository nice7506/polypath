import type { ReactNode, MouseEventHandler } from 'react'

type BackgroundProps = {
  children: ReactNode
  variant?: 'default' | 'subtle'
}

export const Background = ({ children, variant = 'default' }: BackgroundProps) => {
  const glow =
    variant === 'subtle'
      ? [
          'absolute top-[-15%] left-[-10%] h-[320px] w-[320px] rounded-full bg-cyan-500/10 blur-[120px]',
          'absolute bottom-[-15%] right-[-5%] h-[360px] w-[360px] rounded-full bg-purple-500/10 blur-[120px]',
        ]
      : [
          'absolute top-[-20%] left-[-10%] h-[420px] w-[420px] rounded-full bg-cyan-500/10 blur-[140px]',
          'absolute bottom-[-20%] right-[-10%] h-[520px] w-[520px] rounded-full bg-purple-500/10 blur-[160px]',
        ]

  return (
    <div className="relative min-h-screen bg-[#020617] text-slate-200 selection:bg-cyan-500/30">
      <div className="absolute inset-0 pointer-events-none z-0" />
      <div className="absolute inset-0 pointer-events-none z-0" style={{ backgroundImage: NOISE_BG }} />
      <div className={glow[0]} />
      <div className={glow[1]} />
      <div className="relative z-10">{children}</div>
    </div>
  )
}

type PageContainerProps = {
  children: ReactNode
  maxWidth?: '5xl' | '6xl' | '7xl'
  padding?: 'sm' | 'md' | 'lg'
  className?: string
}

export const PageContainer = ({
  children,
  maxWidth = '6xl',
  padding = 'md',
  className = '',
}: PageContainerProps) => {
  const max = {
    '5xl': 'max-w-5xl',
    '6xl': 'max-w-6xl',
    '7xl': 'max-w-7xl',
  }[maxWidth]

  const pad = {
    sm: 'px-4 py-6 md:px-6 md:py-8',
    md: 'px-4 py-8 md:px-10 md:py-10',
    lg: 'px-4 py-10 md:px-12 md:py-12',
  }[padding]

  return <div className={`mx-auto ${max} ${pad} ${className}`}>{children}</div>
}

type SectionHeaderProps = {
  title: ReactNode
  eyebrow?: ReactNode
  subtitle?: ReactNode
  actions?: ReactNode
  align?: 'left' | 'center'
}

export const SectionHeader = ({ title, eyebrow, subtitle, actions, align = 'left' }: SectionHeaderProps) => {
  const isCenter = align === 'center'
  return (
    <div className={`flex flex-col gap-2 ${isCenter ? 'items-center text-center' : ''}`}>
      {eyebrow && (
        <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-mono uppercase tracking-[0.2em] text-slate-400">
          {eyebrow}
        </span>
      )}
      <div className="flex w-full flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div className={isCenter ? 'w-full text-center' : ''}>
          <h2 className="text-2xl font-bold tracking-tight text-white md:text-3xl">{title}</h2>
          {subtitle && <p className="mt-1 text-sm text-slate-400 md:text-base">{subtitle}</p>}
        </div>
        {actions && <div className="flex shrink-0 items-center gap-3">{actions}</div>}
      </div>
    </div>
  )
}

type CardProps = {
  children: ReactNode
  hover?: boolean
  className?: string
  padding?: 'sm' | 'md' | 'lg'
  onClick?: MouseEventHandler<HTMLDivElement>
}

export const Card = ({ children, hover = false, className = '', padding = 'md', onClick }: CardProps) => {
  const pad = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  }[padding]

  return (
    <div
      className={`rounded-2xl border border-white/10 bg-white/[0.02] ${pad} backdrop-blur-sm ${
        hover ? 'transition-all hover:-translate-y-1 hover:border-cyan-500/40 hover:shadow-cyan-500/20' : ''
      } ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  )
}

type StatPillProps = {
  children: ReactNode
  tone?: 'cyan' | 'purple' | 'emerald' | 'neutral'
  className?: string
}

export const StatPill = ({ children, tone = 'neutral', className = '' }: StatPillProps) => {
  const colors: Record<string, string> = {
    cyan: 'border-cyan-500/30 bg-cyan-500/10 text-cyan-200',
    purple: 'border-purple-500/30 bg-purple-500/10 text-purple-200',
    emerald: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200',
    neutral: 'border-white/10 bg-white/5 text-slate-200',
  }
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium ${colors[tone]} ${className}`}
    >
      {children}
    </span>
  )
}

const NOISE_BG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E")`
