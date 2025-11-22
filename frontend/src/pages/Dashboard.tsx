import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Calendar, Clock, FolderGit2, LogOut } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { fetchMyRoadmaps } from '@/lib/api'
import { useAuthStore } from '@/store/authStore'

const bgNoise = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E")`

export default function Dashboard() {
  const navigate = useNavigate()
  const { user, clearUser } = useAuthStore()
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const run = async () => {
      if (!user) return
      setLoading(true)
      setError(null)
      try {
        const rows = await fetchMyRoadmaps(user.id)
        setItems(rows || [])
      } catch (err: any) {
        setError(err?.message || 'Failed to load roadmaps.')
      } finally {
        setLoading(false)
      }
    }
    run()
  }, [user])

  const handleOpen = (id: string) => {
    navigate(`/roadmap/${id}`)
  }

  const handleNew = () => {
    navigate('/start')
  }

  const handleLogout = async () => {
    clearUser()
    navigate('/auth', { replace: true })
  }

  return (
    <div className="relative min-h-screen bg-[#020617] text-slate-200 selection:bg-cyan-500/30">
      <div className="absolute inset-0 pointer-events-none z-0" style={{ backgroundImage: bgNoise }} />
      <div className="absolute top-[-20%] left-[-10%] h-[400px] w-[400px] rounded-full bg-cyan-500/10 blur-[120px]" />
      <div className="absolute bottom-[-20%] right-[-10%] h-[500px] w-[500px] rounded-full bg-purple-500/10 blur-[140px]" />

      <div className="relative z-10 mx-auto flex max-w-6xl flex-col gap-8 px-4 py-8 md:px-10">
        <header className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white md:text-4xl">
              Your Roadmaps
            </h1>
            <p className="mt-2 text-sm text-slate-400">
              Resume where you left off or spin up a new agentic learning path.
            </p>
          </div>
          <div className="flex items-center gap-3">
            {user && (
              <div className="rounded-full border border-white/10 bg-black/40 px-3 py-1 text-xs text-slate-300">
                Signed in as <span className="font-mono text-slate-100">{user.email}</span>
              </div>
            )}
            <Button
              variant="outline"
              className="border-white/20 bg-transparent text-xs text-slate-200 hover:border-red-500/50 hover:bg-red-500/10"
              onClick={handleLogout}
            >
              <LogOut className="mr-1 h-3 w-3" /> Logout
            </Button>
          </div>
        </header>

        <div className="flex items-center justify-between">
          <div className="text-xs text-slate-500">
            {loading
              ? 'Loading your roadmaps…'
              : items.length === 0
              ? 'No roadmaps yet. Start a new mission.'
              : `${items.length} roadmap${items.length === 1 ? '' : 's'} found.`}
          </div>
          <Button
            className="h-10 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 px-4 text-xs font-semibold shadow-cyan-500/30"
            onClick={handleNew}
          >
            + New Roadmap
          </Button>
        </div>

        {error && (
          <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-xs text-red-200">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {items.map((row) => {
            const cfg = row.config || {}
            const fr = row.final_roadmap || {}
            const title = fr.title || cfg.topic || 'Untitled Roadmap'
            const weeks = fr.weeks?.length || cfg.targetWeeks || 0
            const level = cfg.level || 'Intermediate'
            const created = row.created_at ? new Date(row.created_at) : null
            return (
              <button
                key={row.id}
                type="button"
                onClick={() => handleOpen(row.id)}
                className="group flex h-full flex-col justify-between rounded-2xl border border-white/10 bg-white/[0.02] p-5 text-left shadow-lg shadow-black/40 transition-all hover:-translate-y-1 hover:border-cyan-500/40 hover:shadow-cyan-500/20"
              >
                <div className="space-y-3">
                  <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2 py-1 text-[10px] font-mono uppercase tracking-widest text-cyan-300">
                    <FolderGit2 className="h-3 w-3" />
                    Roadmap
                  </div>
                  <h2 className="text-lg font-semibold text-white group-hover:text-cyan-100">{title}</h2>
                  <p className="text-xs text-slate-400 line-clamp-2">
                    {fr.summary || 'Agent-generated roadmap based on your configuration.'}
                  </p>
                </div>

                <div className="mt-4 flex items-center justify-between text-[11px] text-slate-400">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-cyan-400" />
                      {weeks || '—'} weeks
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-purple-400" />
                      {cfg.hours ? `${cfg.hours}h/week` : 'Flexible'}
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="inline-block h-2 w-2 rounded-full bg-emerald-400" />
                      {level}
                    </span>
                  </div>
                  {created && (
                    <span className="font-mono text-[10px] text-slate-500">
                      {created.toLocaleDateString()}
                    </span>
                  )}
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

