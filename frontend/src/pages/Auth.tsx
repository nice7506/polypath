import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Lock, Mail } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { supabase } from '@/lib/supabaseClient'
import { useAuthStore } from '@/store/authStore'

const bgNoise = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E")`

export default function AuthPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const params = new URLSearchParams(location.search)
  const redirect = params.get('redirect') || '/dashboard'

  const { setUser } = useAuthStore()

  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [info, setInfo] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setInfo(null)
    setLoading(true)
    try {
      if (!email || !password) {
        setError('Please enter email and password.')
        return
      }

      if (mode === 'signup') {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        })
        if (signUpError) throw signUpError
        setInfo('Check your email to confirm your account before signing in.')
        return
      }

      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (signInError) {
        const msg = signInError.message || 'Authentication failed.'
        if (msg.toLowerCase().includes('confirm') || msg.toLowerCase().includes('email not confirmed')) {
          setInfo('Please confirm your email before signing in. Check your inbox.')
          return
        }
        throw signInError
      }

      if (data.user) {
        setUser({ id: data.user.id, email: data.user.email ?? null })
        navigate(redirect, { replace: true })
      } else {
        setError('Login succeeded but no user returned.')
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans selection:bg-cyan-500/30 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none z-0" style={{ backgroundImage: bgNoise }} />
      <div className="absolute -top-40 left-0 h-[400px] w-[400px] rounded-full bg-cyan-500/10 blur-[120px]" />
      <div className="absolute bottom-0 right-0 h-[500px] w-[500px] rounded-full bg-purple-500/10 blur-[140px]" />

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-mono uppercase tracking-widest text-slate-400">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            PolyPath Account
          </div>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-white md:text-4xl">
            {mode === 'signin' ? 'Welcome back, agent.' : 'Create your PolyPath account.'}
          </h1>
          <p className="mt-2 max-w-md text-sm text-slate-400">
            {mode === 'signin'
              ? 'Sign in to view your saved roadmaps and continue your learning path.'
              : 'Sign up to save roadmaps, share them, and sync progress across devices.'}
          </p>
        </div>

        <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#020617]/80 p-6 shadow-xl shadow-black/40 backdrop-blur">
          <div className="mb-6 flex gap-2 rounded-lg bg-black/30 p-1 text-xs font-medium">
            <button
              type="button"
              onClick={() => setMode('signin')}
              className={`flex-1 rounded-md px-3 py-2 transition-all ${
                mode === 'signin'
                  ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setMode('signup')}
              className={`flex-1 rounded-md px-3 py-2 transition-all ${
                mode === 'signup'
                  ? 'bg-purple-500 text-black shadow-md shadow-purple-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Sign Up
            </button>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-400">
                Email
              </label>
              <div className="relative">
                <Input
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11 border-white/10 bg-black/40 pl-9 text-sm placeholder:text-slate-600 focus:border-cyan-500/60 focus:ring-cyan-500/30"
                  placeholder="you@example.com"
                />
                <Mail className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-400">
                Password
              </label>
              <div className="relative">
                <Input
                  type="password"
                  autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 border-white/10 bg-black/40 pl-9 text-sm placeholder:text-slate-600 focus:border-cyan-500/60 focus:ring-cyan-500/30"
                  placeholder="••••••••"
                />
                <Lock className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              </div>
            </div>

            {error && (
              <div className="rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-200">
                {error}
              </div>
            )}
            {info && (
              <div className="rounded-md border border-cyan-500/30 bg-cyan-500/10 px-3 py-2 text-xs text-cyan-100">
                {info}
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="mt-2 h-11 w-full rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 text-sm font-semibold shadow-lg shadow-cyan-500/30 hover:from-cyan-500 hover:to-blue-500 disabled:opacity-60"
            >
              {loading ? 'Processing…' : mode === 'signin' ? 'Sign In' : 'Create Account'}
            </Button>
          </form>

          <p className="mt-4 text-center text-[11px] text-slate-500">
            By continuing, you agree to allow PolyPath to store your roadmaps in Supabase for retrieval and sharing.
          </p>
        </div>
      </div>
    </div>
  )
}
