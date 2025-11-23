import { Bolt, Lock, Server } from 'lucide-react'
import type { ReactElement } from 'react'

import { engineCards } from './constants'

const iconMap: Record<string, ReactElement> = {
  lock: <Lock className="w-6 h-6" />,
  servers: <Server className="w-6 h-6" />,
  bolt: <Bolt className="w-6 h-6" />,
}

export const EngineSection = () => (
  <section id="engine" className="relative py-24 overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-b from-[#020617] via-purple-900/10 to-[#020617] pointer-events-none"></div>
    <div className="max-w-7xl mx-auto px-6 relative z-10">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">The Engine Room</h2>
        <p className="text-lg text-slate-400 max-w-2xl mx-auto">
          We don't just guess. We spawn real Docker containers inside E2B sandboxes to visit websites, verify documentation, and ensure your roadmap is actionable.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {engineCards.map((card, idx) => (
          <div
            key={idx}
            className={`rounded-2xl border ${card.border} ${card.bg} p-8 ${card.hover} transition-colors duration-500 group cursor-default`}
          >
            <div
              className={`mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-slate-950 border border-white/10 ${card.color} shadow-xl group-hover:scale-110 transition-transform`}
            >
              {iconMap[card.icon] || <Bolt className="w-6 h-6" />}
            </div>
            <h3 className="text-xl font-bold text-white mb-3">{card.title}</h3>
            <p className="text-slate-300 leading-relaxed">{card.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
)
