import { Layers, Logs, Map, Play } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

const navItems = [
  { to: '/start', label: 'Configure', icon: Layers },
  { to: '/select', label: 'Strategies', icon: Play },
  { to: '/realization', label: 'Console', icon: Logs },
  { to: '/roadmap', label: 'Roadmap', icon: Map },
]

export function Sidebar() {
  const { pathname } = useLocation()

  return (
    <aside className="flex h-full w-64 flex-col border-r border-white/10 bg-[#050811] p-6 text-slate-200">
      <div className="mb-10 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white font-bold shadow-lg shadow-cyan-500/20">
          P
        </div>
        <div>
          <div className="text-sm text-slate-400">PolyPath</div>
          <div className="text-lg font-bold text-white">AI Learning</div>
        </div>
      </div>

      <nav className="space-y-2 text-sm">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = pathname.startsWith(item.to)
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 transition border ${
                active
                  ? 'border-cyan-500/50 bg-cyan-500/10 text-white shadow-lg shadow-cyan-500/20'
                  : 'border-white/5 bg-white/5 text-slate-300 hover:border-cyan-500/30 hover:bg-cyan-500/5'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span className="font-medium">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="mt-auto rounded-lg border border-white/10 bg-white/[0.04] p-4 text-xs text-slate-300 mt-20">
        <div className="text-slate-100 font-semibold mb-1">Need help?</div>
        <div className="text-slate-400">Check logs in Console, or restart from Configure.</div>
        <a
          href="/realization"
          className="mt-3 inline-flex items-center gap-2 rounded-md border border-cyan-500/40 bg-cyan-500/10 px-3 py-2 text-[11px] font-semibold text-cyan-200 hover:bg-cyan-500/20 transition"
        >
          View Console
        </a>
      </div>
    </aside>
  )
}
