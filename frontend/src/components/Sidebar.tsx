import { Home, Layers, Logs, Map, Play } from 'lucide-react'
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
    <aside className="flex h-full w-64 flex-col border-r border-slate-800 bg-[#0b0f1a] p-6 text-slate-200">
      <div className="mb-10 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500 text-black">
          <Home className="h-5 w-5" />
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
              className={`flex items-center gap-3 rounded-lg px-3 py-2 transition ${
                active ? 'bg-slate-800 text-white shadow-inner' : 'hover:bg-slate-800/60'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span className="font-medium">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="mt-auto rounded-lg border border-slate-800 bg-slate-900/60 p-4 text-xs text-slate-400 mt-10">
        <div className="text-slate-200">Need help?</div>
        <div>Check logs in Console, or restart from Configure.</div>
      </div>
    </aside>
  )
}
