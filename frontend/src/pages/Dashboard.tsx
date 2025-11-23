import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Calendar,
  CalendarClock,
  Clock,
  FolderGit2,
  LogOut,
  BookOpen,
  Cpu,
  Target,
  Wallet,
  Sparkles,
  FileText,
  Upload,
  Wand2,
  Search,
  ShieldCheck,
  ExternalLink,
} from 'lucide-react'

import { Background, PageContainer, SectionHeader, Card, StatPill } from '@/components/shared'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { fetchMyRoadmaps, uploadResume, generateResume, searchJobs } from '@/lib/api'
import { useAuthStore } from '@/store/authStore'

export default function Dashboard() {
  const navigate = useNavigate()
  const { user, clearUser } = useAuthStore()
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [resumeFileUrl, setResumeFileUrl] = useState('')
  const [targetRole, setTargetRole] = useState('')
  const [targetLocation, setTargetLocation] = useState('')
  const [keywordText, setKeywordText] = useState('')
  const [resumePdf, setResumePdf] = useState<string | null>(null)
  const [jobResults, setJobResults] = useState<any[]>([])
  const [activityLogs, setActivityLogs] = useState<string[]>([])
  const [resumeError, setResumeError] = useState<string | null>(null)
  const [jobError, setJobError] = useState<string | null>(null)
  const [resumeLoading, setResumeLoading] = useState(false)
  const [jobLoading, setJobLoading] = useState(false)

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

  const parseKeywords = () =>
    (keywordText || '')
      .split(',')
      .map((k) => k.trim())
      .filter(Boolean)

  const handleGenerateResume = async () => {
    if (!user?.id) {
      setResumeError('Sign in to optimize your resume.')
      return
    }
    if (!resumeFileUrl || !targetRole) {
      setResumeError('Add a resume PDF link and target role.')
      return
    }
    setResumeError(null)
    setResumeLoading(true)
    setActivityLogs([])
    try {
      const uploadRes = await uploadResume({ userId: user.id, fileUrl: resumeFileUrl })
      const uploadLogs = uploadRes?.logs || []
      const keywords = parseKeywords()
      const genRes = await generateResume({
        userId: user.id,
        role: targetRole,
        location: targetLocation || undefined,
        keywords,
      })
      const genLogs = genRes?.logs || []
      setResumePdf(genRes.pdfBase64 || null)
      setActivityLogs([...uploadLogs, ...genLogs])
    } catch (err: any) {
      setResumeError(err?.message || 'Failed to optimize resume.')
    } finally {
      setResumeLoading(false)
    }
  }

  const handleSearchJobs = async () => {
    if (!user?.id) {
      setJobError('Sign in to search for roles.')
      return
    }
    if (!targetRole) {
      setJobError('Add a target role to search.')
      return
    }
    setJobError(null)
    setJobLoading(true)
    try {
      const keywords = parseKeywords()
      const res = await searchJobs({
        userId: user.id,
        role: targetRole,
        location: targetLocation || undefined,
        keywords,
      })
      setJobResults(res.results || [])
      if (res.logs) setActivityLogs(res.logs)
    } catch (err: any) {
      setJobError(err?.message || 'Job search failed.')
    } finally {
      setJobLoading(false)
    }
  }

  const roadmapCount = items.length
  const totalWeeks = items.reduce(
    (sum, row) => sum + (row.final_roadmap?.weeks?.length || row.config?.targetWeeks || 0),
    0,
  )
  const averageWeeks = roadmapCount ? Math.round(totalWeeks / roadmapCount) : 0
  const totalResources = items.reduce((sum, row) => {
    const weeks = row.final_roadmap?.weeks || []
    return (
      sum +
      weeks.reduce((weekSum: number, w: any) => weekSum + ((w.resources as any[])?.length || 0), 0)
    )
  }, 0)
  const averageHours = roadmapCount
    ? Math.round(items.reduce((sum, row) => sum + (row.config?.hours || 0), 0) / roadmapCount)
    : 0
  const resumeDownloadUrl = resumePdf ? `data:application/pdf;base64,${resumePdf}` : null

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

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          <Card className="border-cyan-500/30 bg-cyan-500/5">
            <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-cyan-200">
              <Sparkles className="h-3.5 w-3.5" /> Active Roadmaps
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-bold text-white">{roadmapCount || '—'}</span>
              <span className="text-xs text-slate-400">saved</span>
            </div>
            <p className="mt-1 text-xs text-slate-400">Agentic plans stored for quick resume.</p>
          </Card>

          <Card>
            <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-slate-400">
              <Clock className="h-4 w-4 text-purple-300" /> Time Commitment
            </div>
            <div className="mt-2 text-lg font-semibold text-white">
              {averageHours ? `${averageHours}h / week` : 'Flexible pace'}
            </div>
            <p className="text-xs text-slate-400">Avg {averageWeeks || '—'} week span across plans.</p>
          </Card>

          <Card>
            <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-slate-400">
              <BookOpen className="h-4 w-4 text-indigo-300" /> Resource Depth
            </div>
            <div className="mt-2 text-lg font-semibold text-white">
              {totalResources ? `${totalResources} curated resources` : 'Curated items pending'}
            </div>
            <p className="text-xs text-slate-400">Tracked across generated roadmaps.</p>
          </Card>
        </div>

        <div className="mt-8 space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-[10px] uppercase tracking-[0.24em] text-cyan-400 flex items-center gap-2">
                <FileText className="h-3.5 w-3.5" /> Resume & Jobs Module
              </div>
              <h3 className="text-lg font-semibold text-white mt-1">Optimize your resume and pull live matches</h3>
              <p className="text-sm text-slate-400">
                Uses the new resume APIs to parse your PDF, generate a role-ready version, and search matching roles.
              </p>
            </div>
            <StatPill tone="neutral" className="text-[11px]">
              <ShieldCheck className="h-3 w-3" /> Sandbox-backed parsing
            </StatPill>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Card className="space-y-4">
              <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-slate-400">
                <Upload className="h-4 w-4 text-cyan-300" /> Upload & Optimize
              </div>
              <div className="space-y-3">
                <div className="space-y-1">
                  <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Resume PDF Link</div>
                  <Input
                    placeholder="https://.../resume.pdf"
                    value={resumeFileUrl}
                    onChange={(e) => setResumeFileUrl(e.target.value)}
                    className="border-white/10 bg-black/20 text-sm"
                  />
                </div>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <div className="space-y-1">
                    <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Target Role</div>
                    <Input
                      placeholder="Senior Backend Engineer"
                      value={targetRole}
                      onChange={(e) => setTargetRole(e.target.value)}
                      className="border-white/10 bg-black/20 text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Location</div>
                    <Input
                      placeholder="Remote, SF, Berlin..."
                      value={targetLocation}
                      onChange={(e) => setTargetLocation(e.target.value)}
                      className="border-white/10 bg-black/20 text-sm"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Keywords</div>
                  <Input
                    placeholder="TypeScript, distributed systems, AWS (comma-separated)"
                    value={keywordText}
                    onChange={(e) => setKeywordText(e.target.value)}
                    className="border-white/10 bg-black/20 text-sm"
                  />
                </div>
              </div>

              {resumeError && <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-200">{resumeError}</div>}

              <div className="flex flex-wrap gap-3">
                <Button
                  onClick={handleGenerateResume}
                  disabled={resumeLoading}
                  className="bg-cyan-600 hover:bg-cyan-500 text-white"
                >
                  <Wand2 className="mr-2 h-4 w-4" />
                  {resumeLoading ? 'Optimizing...' : 'Generate Optimized Resume'}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleSearchJobs}
                  disabled={jobLoading}
                  className="border-white/20 text-xs text-slate-200 hover:border-cyan-500/40"
                >
                  <Search className="mr-2 h-4 w-4" />
                  {jobLoading ? 'Searching...' : 'Search Matching Jobs'}
                </Button>
              </div>
            </Card>

            <Card className="space-y-4">
              <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-slate-400">
                <Wand2 className="h-4 w-4 text-purple-300" /> Output & Matches
              </div>

              {resumeDownloadUrl ? (
                <div className="flex flex-wrap items-center gap-3 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200">
                  <FileText className="h-4 w-4 text-cyan-300" />
                  Optimized PDF ready
                  <a
                    href={resumeDownloadUrl}
                    download="optimized-resume.pdf"
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-md border border-cyan-500/40 bg-cyan-500/10 px-2 py-1 text-[11px] font-semibold text-cyan-100 hover:bg-cyan-500/20"
                  >
                    Download / View
                  </a>
                </div>
              ) : (
                <p className="text-sm text-slate-500">Run optimize to generate a role-ready PDF.</p>
              )}

              {jobError && <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-200">{jobError}</div>}

              <div>
                <div className="mb-2 flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-slate-400">
                  <Search className="h-4 w-4 text-emerald-300" /> Job Matches
                </div>
                {jobResults.length > 0 ? (
                  <div className="space-y-3">
                    {jobResults.slice(0, 5).map((job: any, idx: number) => (
                      <div key={`${job.url || job.title || idx}-${idx}`} className="rounded-lg border border-white/10 bg-black/30 p-3">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="text-sm font-semibold text-white">{job.title || 'Role'}</div>
                            {job.company && <div className="text-xs text-slate-400">{job.company}</div>}
                          </div>
                          <div className="text-[11px] text-slate-400">{job.location || targetLocation || 'Remote'}</div>
                        </div>
                        <p className="mt-1 text-xs text-slate-400 line-clamp-2">{job.snippet || 'High-signal listing.'}</p>
                        {job.url && (
                          <a
                            href={job.url}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-2 inline-flex items-center gap-1 text-[11px] text-cyan-300 hover:text-cyan-200"
                          >
                            <ExternalLink className="h-3 w-3" /> Open listing
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500">No job matches yet. Add a role and run search.</p>
                )}
              </div>

              {activityLogs.length > 0 && (
                <div>
                  <div className="mb-2 text-[11px] uppercase tracking-[0.2em] text-slate-500">Pipeline Logs</div>
                  <div className="rounded-lg border border-white/10 bg-black/40 p-3 text-[11px] text-slate-400 space-y-1 max-h-40 overflow-y-auto">
                    {activityLogs.slice(-10).map((log, idx) => (
                      <div key={`${log}-${idx}`}>{log}</div>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
          {items.map((row) => {
            const cfg = row.config || {}
            const fr = row.final_roadmap || {}
            const title = fr.title || cfg.topic || 'Untitled Roadmap'
            const weeks = fr.weeks?.length || cfg.targetWeeks || 0
            const level = cfg.level || 'Intermediate'
            const created = row.created_at ? new Date(row.created_at) : null
            const resourceCount = (fr.weeks || []).reduce(
              (sum: number, w: any) => sum + ((w.resources as any[])?.length || 0),
              0,
            )
            const tools = (cfg.preferredTools || '')
              .split(',')
              .map((t: string) => t.trim())
              .filter(Boolean)
            const goal = cfg.goalAlignment || 'Skill ramp'
            const statusRaw =
              typeof row.status === 'string' ? row.status : fr.weeks?.length ? 'Ready' : 'Draft'
            const statusTone =
              ['ready', 'complete', 'finalized'].includes(statusRaw.toLowerCase()) ? 'emerald' : 'neutral'
            const statusLabel = statusRaw.replace(/_/g, ' ')
            return (
              <Card
                key={row.id}
                hover
                className="group flex h-full flex-col justify-between p-5 cursor-pointer"
                onClick={() => handleOpen(row.id)}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <StatPill tone="cyan" className="text-[10px]">
                        <FolderGit2 className="h-3 w-3" />
                        Roadmap
                      </StatPill>
                      <StatPill tone={statusTone} className="text-[10px]">
                        {statusLabel}
                      </StatPill>
                    </div>
                  </div>

                  <div>
                    <h2 className="text-lg font-semibold text-white group-hover:text-cyan-100">{title}</h2>
                    <p className="mt-1 text-xs text-slate-400 line-clamp-2">
                      {fr.summary || 'Agent-generated roadmap based on your configuration.'}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-[12px] text-slate-300">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3.5 w-3.5 text-cyan-400" />
                      <span className="leading-tight">{weeks || '—'} weeks</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-3.5 w-3.5 text-purple-400" />
                      <span className="leading-tight">{cfg.hours ? `${cfg.hours}h/week` : 'Flexible pace'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Target className="h-3.5 w-3.5 text-emerald-400" />
                      <span className="leading-tight">Goal: {goal}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Cpu className="h-3.5 w-3.5 text-blue-300" />
                      <span className="leading-tight">{level}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 text-[11px] text-slate-400">
                    {cfg.style && (
                      <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2.5 py-1">
                        Learning: {cfg.style}
                      </span>
                    )}
                    {cfg.projectType && (
                      <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2.5 py-1">
                        Project: {cfg.projectType}
                      </span>
                    )}
                    {cfg.deadline && (
                      <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2.5 py-1">
                        <CalendarClock className="h-3 w-3 text-amber-400" />
                        {cfg.deadline}
                      </span>
                    )}
                    {cfg.budget && (
                      <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2.5 py-1">
                        <Wallet className="h-3 w-3 text-pink-300" />
                        {cfg.budget}
                      </span>
                    )}
                  </div>

                  {tools.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {tools.slice(0, 4).map((tool: string) => (
                        <span
                          key={tool}
                          className="inline-flex items-center rounded-md bg-cyan-900/30 px-2 py-1 text-[11px] font-semibold text-cyan-100"
                        >
                          {tool}
                        </span>
                      ))}
                      {tools.length > 4 && (
                        <span className="text-[10px] text-slate-500">+{tools.length - 4} more</span>
                      )}
                    </div>
                  )}
                </div>

                <div className="mt-4 flex items-center justify-between text-[11px] text-slate-400">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="flex items-center gap-1">
                      <BookOpen className="h-3 w-3 text-indigo-300" />
                      {resourceCount ? `${resourceCount} resources` : 'Awaiting resources'}
                    </span>
                    <span className="flex items-center gap-1">
                      <FolderGit2 className="h-3 w-3 text-emerald-300" />
                      {cfg.topic || 'Topic pending'}
                    </span>
                  </div>
                  <span className="font-mono text-[10px] text-slate-500">
                    {created ? created.toLocaleDateString() : '—'}
                  </span>
                </div>
              </Card>
            )
          })}
        </div>
      </PageContainer>
    </Background>
  )
}
