import * as React from 'react'

type SliderProps = {
  value?: number[]
  defaultValue?: number[]
  max?: number
  step?: number
  onValueChange?: (val: number[]) => void
  className?: string
}

// Lightweight slider abstraction to mimic shadcn/ui signature used in the page.
export function Slider({ value, defaultValue = [0], max = 100, step = 1, onValueChange, className }: SliderProps) {
  const [internal, setInternal] = React.useState<number[]>(value ?? defaultValue)

  const current = value ?? internal

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const next = [Number(event.target.value)]
    setInternal(next)
    onValueChange?.(next)
  }

  return (
    <input
      type="range"
      min={0}
      max={max}
      step={step}
      value={current[0]}
      onChange={handleChange}
      className={`h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-800 accent-cyan-400 ${className ?? ''}`}
    />
  )
}
