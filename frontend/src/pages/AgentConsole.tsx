import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Terminal, Cpu, ShieldCheck, Wifi, Activity, Server, CheckCircle2, Loader2 } from 'lucide-react'

import { useRoadmap } from '@/context/RoadmapContext'

// --- ASSETS ---
const bgNoise = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E")`

export default function AgentConsole() {
  const navigate = useNavigate()
  const { logs, sandboxId, isRealizing } = useRoadmap()
  const scrollRef = useRef<HTMLDivElement>(null)

  // Mock metrics for the "System Status" sidebar to make it feel alive
  const [metrics, setMetrics] = useState({ cpu: 12, ram: 45 })

  // Auto-scroll terminal to bottom when logs update
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [logs])

  // Simulate fluctuating system metrics
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics({
        cpu: Math.floor(Math.random() * (40 - 10) + 10),
        ram: Math.floor(Math.random() * (60 - 40) + 40),
      })
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  // Navigation Logic
  useEffect(() => {
    // Only kick back to /start if we truly have no active or completed run
    if (!isRealizing && !sandboxId && logs.length === 0) {
      navigate('/start')
    }
  }, [sandboxId, isRealizing, logs.length, navigate])

  useEffect(() => {
    // Once realization is done and we have logs, move on to the roadmap,
    // even if sandboxId is null (e.g., sandbox disabled but roadmap generated).
    if (!isRealizing && logs.length > 0) {
      // Small delay to let user see the "Success" message before redirecting
      const timeout = setTimeout(() => {
        navigate('/roadmap')
      }, 1500)
      return () => clearTimeout(timeout)
    }
  }, [sandboxId, isRealizing, navigate, logs])

  // Helper to colorize logs based on content
  const getLogStyle = (text: string) => {
    if (text.toLowerCase().includes('error') || text.toLowerCase().includes('failed')) return 'text-red-400'
    if (text.toLowerCase().includes('success') || text.toLowerCase().includes('verified')) return 'text-emerald-400'
    if (text.toLowerCase().includes('warning')) return 'text-yellow-400'
    if (text.startsWith('>')) return 'text-cyan-300 font-bold' // Commands
    return 'text-slate-300'
  }

  return (
    <div className="relative flex min-h-screen flex-col bg-[#020617] text-slate-200 font-sans overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none z-0" style={{ backgroundImage: bgNoise }}></div>
      <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between border-b border-white/5 bg-[#020617]/80 px-6 py-4 backdrop-blur-md">
        <div className="flex items-center gap-3">
           <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 font-bold text-white shadow-lg shadow-cyan-500/20">
             P
           </div>
           <span className="text-lg font-bold text-white tracking-tight">PolyPath <span className="text-slate-500 font-normal">/ Console</span></span>
        </div>
        <div className="flex items-center gap-3 text-xs font-mono">
           <span className="flex items-center gap-1.5 text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded border border-emerald-400/20">
             <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
             LIVE CONNECTION
           </span>
           <span className="text-slate-500">ID: {sandboxId || 'INIT_...'}</span>
        </div>
      </header>

      <main className="relative z-10 flex flex-1 items-center justify-center p-4 md:p-8">
        <div className="grid w-full max-w-6xl grid-cols-1 gap-6 lg:grid-cols-4">
          
          {/* Left Column: System Status Sidebar */}
          <div className="flex flex-col gap-4 lg:col-span-1">
            
            {/* Agent Status Card */}
            <div className="rounded-xl border border-white/10 bg-[#0F1117]/50 p-5 backdrop-blur-sm">
              <h3 className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500">
                <Activity className="h-3 w-3" /> System Metrics
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="mb-1 flex justify-between text-xs text-slate-400">
                    <span>CPU Usage</span>
                    <span>{metrics.cpu}%</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
                    <div className="h-full bg-cyan-500 transition-all duration-500" style={{ width: `${metrics.cpu}%` }} />
                  </div>
                </div>
                <div>
                  <div className="mb-1 flex justify-between text-xs text-slate-400">
                    <span>Memory Allocation</span>
                    <span>{metrics.ram}%</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
                    <div className="h-full bg-purple-500 transition-all duration-500" style={{ width: `${metrics.ram}%` }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Environment Info Card */}
            <div className="rounded-xl border border-white/10 bg-[#0F1117]/50 p-5 backdrop-blur-sm flex-1">
              <h3 className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500">
                <Server className="h-3 w-3" /> Environment
              </h3>
              <ul className="space-y-3 text-sm text-slate-300">
                <li className="flex items-center gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded bg-orange-500/10 text-orange-400">
                    <span className="text-xs font-bold">E2B</span>
                  </div>
                  <span>Sandbox: <span className="text-emerald-400">Active</span></span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded bg-blue-500/10 text-blue-400">
                    <span className="text-xs font-bold">DKR</span>
                  </div>
                  <span>Docker: <span className="text-slate-400">v24.0.6</span></span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded bg-purple-500/10 text-purple-400">
                    <span className="text-xs font-bold">AI</span>
                  </div>
                  <span>Agent: <span className="text-cyan-400">Reasoning...</span></span>
                </li>
              </ul>

              <div className="mt-6 border-t border-white/5 pt-4">
                 <div className="flex items-center gap-2 text-xs text-slate-500">
                    <ShieldCheck className="h-3 w-3" /> Secure Connection Verified
                 </div>
              </div>
            </div>
          </div>

          {/* Right Column: The Terminal */}
          <div className="lg:col-span-3 flex flex-col h-[600px] rounded-xl border border-white/10 bg-[#0b0d13] shadow-2xl shadow-black/50 overflow-hidden ring-1 ring-white/5 relative group">
            
            {/* Terminal Header */}
            <div className="flex h-10 shrink-0 items-center justify-between border-b border-white/5 bg-[#13161c] px-4">
               <div className="flex gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-500/80 hover:bg-red-500 transition-colors" />
                  <div className="h-3 w-3 rounded-full bg-yellow-500/80 hover:bg-yellow-500 transition-colors" />
                  <div className="h-3 w-3 rounded-full bg-emerald-500/80 hover:bg-emerald-500 transition-colors" />
               </div>
               <div className="flex items-center gap-2 text-xs text-slate-500 font-mono opacity-70">
                  <Terminal className="h-3 w-3" />
                  agent_swarm.sh — bash
               </div>
               <div className="w-10" /> {/* Spacer for centering */}
            </div>

            {/* Logs Area */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-6 font-mono text-sm leading-relaxed scroll-smooth"
              style={{ scrollbarWidth: 'thin', scrollbarColor: '#334155 transparent' }}
            >
              <div className="space-y-2">
                {/* Static Start Message */}
                <div className="text-slate-500 border-b border-white/5 pb-2 mb-4">
                  <span className="text-cyan-500">➜</span> Initializing PolyPath Agent Swarm [v2.1.0]<br/>
                  <span className="text-slate-600">   Copyright (c) 2025 PolyPath Inc.</span>
                </div>

                {/* Dynamic Logs */}
                {logs.length === 0 ? (
                  <div className="flex items-center gap-2 text-slate-500 animate-pulse">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Establishing secure handshake with Sandbox...
                  </div>
                ) : (
                   logs.map((log, i) => (
                    <div key={i} className={`break-all ${getLogStyle(log)} flex gap-3`}>
                      <span className="text-slate-700 select-none min-w-[40px] text-right text-[10px] pt-1">
                        {new Date().toLocaleTimeString('en-US', {hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit"})}
                      </span>
                      <span>{log}</span>
                    </div>
                   ))
                )}
                
                {/* Blinking Cursor */}
                <div className="pt-2">
                   <span className="inline-block h-5 w-2.5 bg-slate-500 animate-pulse align-middle" />
                </div>
              </div>
            </div>

            {/* Terminal Status Footer */}
            <div className="h-8 shrink-0 border-t border-white/5 bg-[#13161c] px-4 flex items-center justify-between text-[10px] font-mono text-slate-500">
               <div className="flex gap-4">
                  <span>UTF-8</span>
                  <span className="flex items-center gap-1"><Wifi className="h-3 w-3" /> 14ms</span>
               </div>
               <div className="flex items-center gap-2">
                  {isRealizing ? (
                    <span className="text-cyan-500 flex items-center gap-1">
                       <Loader2 className="h-3 w-3 animate-spin" /> EXECUTING
                    </span>
                  ) : logs.length > 0 ? (
                    <span className="text-emerald-500 flex items-center gap-1">
                       <CheckCircle2 className="h-3 w-3" /> COMPLETED
                    </span>
                  ) : (
                    <span>IDLE</span>
                  )}
               </div>
            </div>

            {/* Glow Effect behind terminal */}
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 to-purple-600/20 rounded-xl blur-2xl -z-10 opacity-20 group-hover:opacity-30 transition-opacity duration-500" />
          </div>

        </div>
      </main>
    </div>
  )
}
