import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Calendar, Clock, FolderGit2, LogOut } from 'lucide-react'

import { Background, PageContainer, SectionHeader, Card, StatPill } from '@/components/shared'
import { Button } from '@/components/ui/button'
import { fetchMyRoadmaps } from '@/lib/api'
import { useAuthStore } from '@/store/authStore'

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
    <Background>
      <PageContainer maxWidth="6xl">
        <SectionHeader
          title="Your Roadmaps"
          subtitle="Resume where you left off or spin up a new agentic learning path."
          actions={
            <div className="flex items-center gap-3">
              {user && (
                <StatPill tone="neutral">
                  Signed in as <span className="font-mono text-slate-100">{user.email}</span>
                </StatPill>
              )}
              <Button
                variant="outline"
                className="border-white/20 bg-transparent text-xs text-slate-200 hover:border-red-500/50 hover:bg-red-500/10"
                onClick={handleLogout}
              >
                <LogOut className="mr-1 h-3 w-3" /> Logout
              </Button>
            </div>
          }
        />

        <div className="mt-6 flex items-center justify-between">
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
          <div className="mt-4 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-xs text-red-200">
            {error}
          </div>
        )}

        <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
          {items.map((row) => {
            const cfg = row.config || {}
            const fr = row.final_roadmap || {}
            const title = fr.title || cfg.topic || 'Untitled Roadmap'
            const weeks = fr.weeks?.length || cfg.targetWeeks || 0
            const level = cfg.level || 'Intermediate'
            const created = row.created_at ? new Date(row.created_at) : null
            return (
              <Card
                key={row.id}
                hover
                className="group flex h-full flex-col justify-between p-5 cursor-pointer"
                onClick={() => handleOpen(row.id)}
              >
                <div className="space-y-3">
                  <StatPill tone="cyan" className="text-[10px]">
                    <FolderGit2 className="h-3 w-3" />
                    Roadmap
                  </StatPill>
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
              </Card>
            )
          })}
        </div>
      </PageContainer>
    </Background>
  )
}
