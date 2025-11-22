import * as React from 'react'

import { cn } from '@/lib/utils'

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'outline' | 'muted'
}

const badgeStyles: Record<NonNullable<BadgeProps['variant']>, string> = {
  default:
    'border-transparent bg-primary/90 text-primary-foreground shadow-sm ring-1 ring-primary/40',
  outline: 'border-border bg-background/60 text-foreground ring-1 ring-border/60',
  muted: 'border-transparent bg-muted text-muted-foreground',
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide',
        badgeStyles[variant],
        className,
      )}
      {...props}
    />
  )
}
