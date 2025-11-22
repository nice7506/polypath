import React, { useEffect, useState } from 'react';

// --- ASSETS & STYLES ---
// Background Noise Pattern (Data URI)
const bgNoise = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E")`;

// --- DATA CONSTANTS ---
const featureItems = [
  { id: '01', title: 'Goal Alignment', desc: 'Defines the ultimate objective.' },
  { id: '02', title: 'Learning Style', desc: 'Video vs Text vs Code.' },
  { id: '03', title: 'Budget', desc: 'Tailors financial constraints.' },
  { id: '04', title: 'Time/Week', desc: 'Schedules based on availability.' },
  { id: '05', title: 'Skill Level', desc: "Calibrates difficulty curve." },
  { id: '06', title: 'Device Specs', desc: 'Optimizes tools for hardware.' },
  { id: '07', title: 'Preferred Tools', desc: 'Integrates with your stack.' },
  { id: '08', title: 'Project Type', desc: 'Focuses on real-world apps.' },
  { id: '09', title: 'Language', desc: 'Prioritizes specific syntax.' },
  { id: '10', title: 'Deadline', desc: 'Structures to meet target dates.' },
];

const engineCards = [
  {
    title: 'Secure Execution',
    desc: 'Isolated E2B Sandboxes provide a safe environment for agents to run code and test solutions.',
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />,
    color: 'text-emerald-400',
    border: 'border-emerald-500/20',
    bg: 'bg-emerald-500/5',
    hover: 'hover:bg-emerald-500/10'
  },
  {
    title: 'Replicable Env',
    desc: 'Docker ensures consistent, version-controlled environments for every learning module.',
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />,
    color: 'text-blue-400',
    border: 'border-blue-500/20',
    bg: 'bg-blue-500/5',
    hover: 'hover:bg-blue-500/10'
  },
  {
    title: 'Gemini RAG',
    desc: 'Intelligent vectors allow agents to pull the most relevant information to construct learning steps.',
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />,
    color: 'text-purple-400',
    border: 'border-purple-500/20',
    bg: 'bg-purple-500/5',
    hover: 'hover:bg-purple-500/10'
  },
];

const navLinks = ['Features', 'Architecture', 'Engine', 'Pricing'];
const logos = ["ACME_CORP", "GlobalTech", "DevInc", "CodeFlow"];

export default function LandingPage() {
  return (
    <div className="bg-[#020617] text-slate-200 font-sans selection:bg-cyan-500/30 antialiased overflow-x-hidden">
      {/* Font Injection for Inter/JetBrains Mono */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;800&family=JetBrains+Mono:wght@400;700&display=swap');
        .font-mono { font-family: 'JetBrains Mono', monospace; }
        .perspective-1000 { perspective: 1000px; }
        /* Custom Scrollbar */
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: #020617; }
        ::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: #06b6d4; }
      `}</style>

      {/* --- NAVBAR --- */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#020617]/80 backdrop-blur-md transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer group">
            <div className="h-8 w-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-all">P</div>
            <span className="text-xl font-bold text-white tracking-tight group-hover:text-cyan-100 transition-colors">PolyPath</span>
          </div>

          {/* Links (Desktop) */}
          <div className="hidden md:flex gap-8 text-sm font-medium text-slate-400">
            {navLinks.map(link => (
              <a key={link} href={`#${link.toLowerCase()}`} className="hover:text-cyan-400 transition-colors">{link}</a>
            ))}
          </div>

          {/* CTA */}
          <div className="flex items-center gap-4">
            <button className="text-sm font-medium text-white hover:text-cyan-400 hidden sm:block transition-colors">Sign In</button>
            <button className="h-9 px-5 rounded-full bg-white text-slate-950 text-sm font-bold hover:bg-cyan-50 transition-all hover:shadow-[0_0_15px_rgba(255,255,255,0.3)] transform hover:scale-105">
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 pointer-events-none animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-[120px] translate-x-1/2 translate-y-1/2 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Hero Text */}
          <div className="text-center lg:text-left space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-xs font-medium text-cyan-300 backdrop-blur-sm hover:border-cyan-400/50 transition-colors cursor-default">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
              v2.0 Now Live: Powered by E2B & Gemini
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-[1.1] tracking-tight">
              Stop Guessing. <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600">
                Start Learning.
              </span>
            </h1>

            <p className="text-lg text-slate-400 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Generate hyper-personalized curriculums. We spin up <strong className="text-white">Autonomous Agents</strong> and <strong className="text-white">Docker Containers</strong> to verify every resource in real-time.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                to="/start"
                className="h-14 px-8 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 hover:scale-105 transition-all duration-300 w-full sm:w-auto flex items-center justify-center gap-2 group"
              >
                Draft Your Roadmap
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
              </Link>
              <button className="h-14 px-8 rounded-lg border border-slate-700 bg-slate-800/50 text-white font-semibold backdrop-blur-sm hover:bg-slate-800 hover:border-slate-600 transition-all w-full sm:w-auto">
                View Architecture
              </button>
            </div>

            {/* Social Proof */}
            <div className="pt-8 border-t border-white/5 mt-8">
              <p className="text-xs text-slate-500 mb-4 font-mono tracking-widest uppercase">Trusted by builders at</p>
              <div className="flex flex-wrap justify-center lg:justify-start gap-8 opacity-40 grayscale transition-opacity hover:opacity-100 hover:grayscale-0 duration-500">
                {logos.map(logo => (
                  <span key={logo} className="text-xl font-bold font-mono">{logo}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Visual: The 3D Terminal */}
          <div className="perspective-1000 relative group hidden lg:block">
            <div 
              className="relative rounded-xl border border-white/10 bg-[#0F1117]/95 shadow-2xl backdrop-blur-xl overflow-hidden transition-transform duration-500 ease-out"
              style={{ 
                transform: 'rotateY(-5deg) rotateX(2deg)',
                boxShadow: '-20px 20px 60px rgba(0,0,0,0.5)'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'rotateY(0) rotateX(0)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'rotateY(-5deg) rotateX(2deg)'}
            >
              {/* Terminal Header */}
              <div className="flex h-10 items-center gap-2 border-b border-white/5 bg-[#1A1D24] px-4">
                <div className="h-3 w-3 rounded-full bg-red-500/80"></div>
                <div className="h-3 w-3 rounded-full bg-yellow-500/80"></div>
                <div className="h-3 w-3 rounded-full bg-emerald-500/80"></div>
                <div className="ml-auto text-xs text-slate-500 font-mono">agent_console — bash — 80x24</div>
              </div>
              {/* Terminal Body */}
              <div className="p-6 font-mono text-sm space-y-3 min-h-[360px] text-slate-300">
                <div>
                  <span className="text-emerald-400 mr-2">➜</span>
                  <span className="text-slate-200">init_profile</span>
                  <span className="text-purple-400 ml-2">--topic="Rust" --level="Advanced"</span>
                </div>
                <div className="text-slate-500 text-xs pl-6 pb-2">Analyzed 10 constraints...</div>

                <div>
                  <span className="text-emerald-400 mr-2">➜</span>
                  <span className="text-slate-200">spawn_agent</span>
                  <span className="text-blue-400 ml-2">--env=E2B_Sandbox</span>
                </div>
                <div className="text-slate-500 text-xs pl-6">Spawning secure VM [id: e2b-8f2a]...</div>

                {/* Inner Card */}
                <div className="pl-6 border-l border-white/10 space-y-2 py-3 my-2 bg-white/5 rounded-r-lg">
                  <div className="flex items-center gap-2 text-slate-400">
                    <span>{'>'} Pulling Docker Image: ghcr.io/puppeteer...</span>
                    <span className="text-emerald-400 text-xs border border-emerald-500/30 bg-emerald-500/10 px-1 rounded font-bold">DONE</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400">
                    <span>{'>'} Scraping docs.rust-lang.org...</span>
                    <span className="text-emerald-400 text-xs border border-emerald-500/30 bg-emerald-500/10 px-1 rounded font-bold">200 OK</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400">
                    <span>{'>'} Verifying code samples...</span>
                    <span className="text-emerald-400 text-xs border border-emerald-500/30 bg-emerald-500/10 px-1 rounded font-bold">PASS</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-emerald-400 mr-2">➜</span>
                  <span className="text-slate-200">generate_roadmap</span>
                  <span className="inline-block w-2 h-5 bg-slate-500 animate-pulse ml-2"></span>
                </div>
              </div>
            </div>
            
            {/* Background Glow behind terminal */}
            <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl blur-2xl opacity-20 -z-10 transition-opacity group-hover:opacity-30"></div>
          </div>
        </div>
      </section>

      {/* --- ARCHITECTURE PIPELINE --- */}
      <section id="architecture" className="py-24 border-y border-white/5 bg-[#050811] relative overflow-hidden">
        <div className="absolute inset-0" style={{ backgroundImage: bgNoise }}></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-3xl font-bold text-white">The Architecture</h2>
            <p className="text-slate-400 mt-2 text-lg">How PolyPath turns simple prompts into verified, actionable knowledge.</p>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-8 relative">
            {/* Connecting Line */}
            <div className="hidden md:block absolute top-10 left-0 w-full h-0.5 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-emerald-500/20 -z-10"></div>

            {[
              { emoji: '👤', title: 'User Context', sub: '10-Point Profile', color: 'cyan' },
              { emoji: '🧠', title: 'Gemini Brain', sub: 'Strategy Drafting', color: 'purple' },
              { emoji: '📦', title: 'E2B Sandbox', sub: 'Docker Execution', color: 'orange' },
              { emoji: '✅', title: 'Verified Path', sub: 'RAG Memory', color: 'emerald' },
            ].map((step, idx) => (
              <div key={idx} className="relative group text-center w-full md:w-auto">
                <div className={`w-20 h-20 mx-auto bg-[#0F1117] border border-${step.color}-500/30 rounded-2xl flex items-center justify-center shadow-lg shadow-${step.color}-500/10 group-hover:scale-110 group-hover:border-${step.color}-500 group-hover:shadow-${step.color}-500/30 transition-all duration-300 z-10`}>
                  <span className="text-3xl">{step.emoji}</span>
                </div>
                <h3 className="mt-6 font-bold text-white text-lg">{step.title}</h3>
                <p className="text-sm text-slate-500 mt-1 font-mono">{step.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- 10-POINT PRECISION GRID --- */}
      <section id="features" className="py-24 bg-[#020617]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-16 max-w-3xl">
            <h2 className="text-3xl font-bold tracking-tight text-white">10-Point Precision Input</h2>
            <p className="mt-4 text-lg text-slate-400">Most AI wrappers use a single prompt. PolyPath uses ten specific data points to architect your perfect curriculum.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {featureItems.map((item) => (
              <div key={item.id} className="group p-5 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-cyan-500/30 transition-all duration-300 hover:-translate-y-1">
                <div className="text-xs font-mono text-cyan-500 mb-3">{item.id}</div>
                <h3 className="text-white font-bold mb-2">{item.title}</h3>
                <p className="text-sm text-slate-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- THE ENGINE ROOM --- */}
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
              <div key={idx} className={`rounded-2xl border ${card.border} ${card.bg} p-8 ${card.hover} transition-colors duration-500 group cursor-default`}>
                <div className={`mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-slate-950 border border-white/10 ${card.color} shadow-xl group-hover:scale-110 transition-transform`}>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {card.icon}
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{card.title}</h3>
                <p className="text-slate-300 leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- DEVELOPER TRANSPARENCY --- */}
      <section className="py-24 bg-[#0B0F19] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <h2 className="text-3xl md:text-4xl font-bold text-white">Built for Developers.<br/><span className="text-slate-500">Transparent & Configurable.</span></h2>
            <p className="text-lg text-slate-400 leading-relaxed">PolyPath isn't a black box. You get structured JSON outputs, verified code blocks, and full visibility into the agent's execution logs.</p>
            <div className="space-y-4">
              <div className="flex gap-4 items-start">
                <div className="mt-1 w-6 h-6 rounded-full bg-cyan-500/10 text-cyan-400 flex items-center justify-center text-sm font-bold">✓</div>
                <div><h3 className="font-bold text-white">Clarity at a Glance</h3><p className="text-sm text-slate-400">Visualize complex tasks with structured roadmaps.</p></div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="mt-1 w-6 h-6 rounded-full bg-cyan-500/10 text-cyan-400 flex items-center justify-center text-sm font-bold">✓</div>
                <div><h3 className="font-bold text-white">Verifiable Steps</h3><p className="text-sm text-slate-400">Ensure every step is accurate via Docker.</p></div>
              </div>
            </div>
          </div>

          {/* Code Window */}
          <div className="rounded-xl bg-[#1A1D24] border border-white/10 shadow-2xl overflow-hidden font-mono text-xs md:text-sm">
            <div className="flex items-center justify-between px-4 py-2 border-b border-white/5 bg-[#0F1117]">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <div className="text-slate-500">config.ts</div>
            </div>
            <div className="p-6 text-slate-300 overflow-x-auto">
              <p><span className="text-purple-400">const</span> <span className="text-blue-400">agentConfig</span> = {'{'}</p>
              <p className="pl-4">environment: <span className="text-emerald-400">'E2B_Sandbox'</span>,</p>
              <p className="pl-4">containers: [</p>
              <p className="pl-8"><span className="text-emerald-400">'ghcr.io/puppeteer/puppeteer:latest'</span>,</p>
              <p className="pl-8"><span className="text-emerald-400">'node:18-alpine'</span></p>
              <p className="pl-4">],</p>
              <p className="pl-4">memory: <span className="text-purple-400">new</span> <span className="text-yellow-400">VectorStore</span>(GeminiEmbeddings),</p>
              <p className="pl-4">timeout: <span className="text-orange-400">60000</span> <span className="text-slate-500">// 60s verification limit</span></p>
              <p>{'};'}</p>
              <p className="mt-4"><span className="text-slate-500">// Executing verification swarm...</span></p>
              <p><span className="text-blue-400">await</span> agent.<span className="text-yellow-400">verify</span>(roadmap);</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- US vs THEM --- */}
      <section id="pricing" className="py-24 bg-[#020617]">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-white mb-12">Why PolyPath Wins</h2>
          <div className="grid md:grid-cols-3 gap-px bg-white/10 border border-white/10 rounded-xl overflow-hidden">
            
            {/* Column 1: Labels */}
            <div className="bg-[#0F1117] p-8 flex flex-col justify-center gap-8">
              <span className="font-bold text-transparent">Feature</span>
              <span className="font-bold text-slate-400">Knowledge Source</span>
              <span className="font-bold text-slate-400">Verification</span>
              <span className="font-bold text-slate-400">Personalization</span>
            </div>

            {/* Column 2: Them */}
            <div className="bg-[#0F1117] p-8 flex flex-col items-center justify-center gap-8 text-center opacity-50">
              <span className="font-bold text-slate-500 text-lg">Generic AI Chat</span>
              <span className="text-slate-400">Training Data (Old)</span>
              <span className="text-slate-400">None (Hallucinations)</span>
              <span className="text-slate-400">Generic Prompting</span>
            </div>

            {/* Column 3: Us */}
            <div className="bg-[#0F1117] p-8 flex flex-col items-center justify-center gap-8 text-center relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-1 bg-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.5)]"></div>
              <div className="absolute inset-0 bg-cyan-500/5"></div>
              <span className="font-bold text-cyan-400 text-lg">PolyPath</span>
              <span className="text-white font-bold">Live Web + RAG</span>
              <span className="text-white font-bold">Docker Execution</span>
              <span className="text-white font-bold">10-Point Profile</span>
            </div>
          </div>
        </div>
      </section>

      {/* --- FINAL CTA --- */}
      <section className="py-24 px-4 text-center relative overflow-hidden border-t border-white/5">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B0F19] to-[#020617]"></div>
        <div className="relative z-10 max-w-4xl mx-auto space-y-8">
          <h2 className="text-5xl md:text-6xl font-bold text-white tracking-tight">
            Ready to Build?
          </h2>
          <p className="text-xl text-slate-400">
            Join thousands of developers mastering new stacks with Agentic AI.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
            <button className="w-full sm:w-auto h-16 px-12 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-xl hover:shadow-[0_0_40px_rgba(6,182,212,0.4)] hover:scale-105 transition-all duration-300">
              Start Free Trial
            </button>
            <button className="w-full sm:w-auto h-16 px-12 rounded-full bg-slate-800 text-white font-bold hover:bg-slate-700 transition-colors border border-white/10">
              Read Documentation
            </button>
          </div>

          {/* Status Indicators */}
          <div className="pt-12 flex flex-wrap justify-center gap-3 opacity-60">
            <div className="text-xs font-mono border border-white/10 bg-white/5 px-3 py-1 rounded-full text-slate-400">Draft Your Roadmap</div>
            <div className="text-xs font-mono border border-white/10 bg-white/5 px-3 py-1 rounded-full text-slate-400 flex items-center gap-2">
              <span className="inline-block w-2 h-2 bg-cyan-500 rounded-full animate-pulse"></span> Initializing Agents...
            </div>
            <div className="text-xs font-mono border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 rounded-full text-emerald-400">Roadmap Ready!</div>
            <div className="text-xs font-mono border border-white/10 bg-white/5 px-3 py-1 rounded-full text-slate-400">Agent Failed: Retry</div>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="border-t border-white/5 bg-[#020617] pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid gap-12 lg:grid-cols-4 mb-12">
            <div className="lg:col-span-1 space-y-4">
              <div className="flex items-center gap-2 text-white font-bold text-xl">
                <div className="h-6 w-6 bg-cyan-500 rounded flex items-center justify-center text-xs shadow-lg shadow-cyan-500/30">P</div>
                PolyPath
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">The Agentic Learning Platform. Powered by E2B Sandboxes and Google Gemini.</p>
            </div>
            <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h4 className="font-bold text-white mb-4">Product</h4>
                <ul className="space-y-2 text-sm text-slate-400">
                  <li><a href="#" className="hover:text-cyan-400 transition-colors">Features</a></li>
                  <li><a href="#" className="hover:text-cyan-400 transition-colors">Architecture</a></li>
                  <li><a href="#" className="hover:text-cyan-400 transition-colors">Engine</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-white mb-4">Company</h4>
                <ul className="space-y-2 text-sm text-slate-400">
                  <li><a href="#" className="hover:text-cyan-400 transition-colors">About</a></li>
                  <li><a href="#" className="hover:text-cyan-400 transition-colors">Careers</a></li>
                  <li><a href="#" className="hover:text-cyan-400 transition-colors">Blog</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-white mb-4">Resources</h4>
                <ul className="space-y-2 text-sm text-slate-400">
                  <li><a href="#" className="hover:text-cyan-400 transition-colors">Docs</a></li>
                  <li><a href="#" className="hover:text-cyan-400 transition-colors">Community</a></li>
                  <li><a href="#" className="hover:text-cyan-400 transition-colors">Status</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-xs text-slate-600 font-mono">SYSTEM STATUS: <span className="text-emerald-500 animate-pulse">● OPERATIONAL</span></div>
            <div className="text-slate-500 text-sm">© 2025 PolyPath Inc.</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
import { Link } from 'react-router-dom'
