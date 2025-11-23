import { Link } from 'react-router-dom'

import { logos } from './constants'

export const LandingHero = () => (
  <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
    <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 pointer-events-none animate-pulse"></div>
    <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-[120px] translate-x-1/2 translate-y-1/2 pointer-events-none"></div>

    <div className="max-w-7xl mx-auto px-6 relative z-10 grid lg:grid-cols-2 gap-16 items-center">
      <div className="text-center lg:text-left space-y-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-xs font-medium text-cyan-300 backdrop-blur-sm hover:border-cyan-400/50 transition-colors cursor-default">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
          </span>
          v2.0 Now Live: Powered by E2B & Gemini
        </div>

        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-[1.1] tracking-tight">
          Stop Guessing. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600">Start Learning.</span>
        </h1>

        <p className="text-lg text-slate-400 max-w-xl mx-auto lg:mx-0 leading-relaxed">
          Generate hyper-personalized curriculums. We spin up <strong className="text-white">Autonomous Agents</strong> and{' '}
          <strong className="text-white">Docker Containers</strong> to verify every resource in real-time.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
          <Link
            to="/start"
            className="h-14 px-8 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 hover:scale-105 transition-all duration-300 w-full sm:w-auto flex items-center justify-center gap-2 group"
          >
            Draft Your Roadmap
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
            </svg>
          </Link>
        </div>

        <div className="pt-8 border-t border-white/5 mt-8">
          <p className="text-xs text-slate-500 mb-4 font-mono tracking-widest uppercase">Trusted by builders at</p>
          <div className="flex flex-wrap justify-center lg:justify-start gap-8 opacity-40 grayscale transition-opacity hover:opacity-100 hover:grayscale-0 duration-500">
            {logos.map((logo) => (
              <span key={logo} className="text-xl font-bold font-mono">
                {logo}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="perspective-1000 relative group hidden lg:block">
        <div
          className="relative rounded-xl border border-white/10 bg-[#0F1117]/95 shadow-2xl backdrop-blur-xl overflow-hidden transition-transform duration-500 ease-out"
          style={{
            transform: 'rotateY(-5deg) rotateX(2deg)',
            boxShadow: '-20px 20px 60px rgba(0,0,0,0.5)',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'rotateY(0) rotateX(0)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'rotateY(-5deg) rotateX(2deg)')}
        >
          <div className="flex h-10 items-center gap-2 border-b border-white/5 bg-[#1A1D24] px-4">
            <div className="h-3 w-3 rounded-full bg-red-500/80"></div>
            <div className="h-3 w-3 rounded-full bg-yellow-500/80"></div>
            <div className="h-3 w-3 rounded-full bg-emerald-500/80"></div>
            <div className="ml-auto text-xs text-slate-500 font-mono">agent_console — bash — 80x24</div>
          </div>
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

            <div className="pl-6 border-l border-white/10 space-y-2 py-3 my-2 bg-white/5 rounded-r-lg">
              <div className="flex items-center gap-2 text-slate-400">
                <span>{'>'} Pulling Docker Image: ghcr.io/puppeteer...</span>
                <span className="text-emerald-400 text-xs border border-emerald-500/30 bg-emerald-500/10 px-1 rounded font-bold">
                  DONE
                </span>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <span>{'>'} Scraping docs.rust-lang.org...</span>
                <span className="text-emerald-400 text-xs border border-emerald-500/30 bg-emerald-500/10 px-1 rounded font-bold">
                  200 OK
                </span>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <span>{'>'} Verifying code samples...</span>
                <span className="text-emerald-400 text-xs border border-emerald-500/30 bg-emerald-500/10 px-1 rounded font-bold">
                  PASS
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-emerald-400 mr-2">➜</span>
              <span className="text-slate-200">generate_roadmap</span>
              <span className="inline-block w-2 h-5 bg-slate-500 animate-pulse ml-2"></span>
            </div>
          </div>
        </div>
        <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl blur-2xl opacity-20 -z-10 transition-opacity group-hover:opacity-30"></div>
      </div>
    </div>
  </section>
)
