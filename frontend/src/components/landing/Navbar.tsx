import { navLinks } from './constants'

export const LandingNavbar = () => (
  <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#020617]/80 backdrop-blur-md transition-all duration-300">
    <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
      <div className="flex items-center gap-2 cursor-pointer group">
        <div className="h-8 w-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-all">
          P
        </div>
        <span className="text-xl font-bold text-white tracking-tight group-hover:text-cyan-100 transition-colors">PolyPath</span>
      </div>

      <div className="hidden md:flex gap-8 text-sm font-medium text-slate-400">
        {navLinks.map((link) => (
          <a key={link} href={`#${link.toLowerCase()}`} className="hover:text-cyan-400 transition-colors">
            {link}
          </a>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <a href="/auth" className="text-sm font-medium text-white hover:text-cyan-400 hidden sm:block transition-colors">
          Sign In
        </a>
        <a
          href="/start"
          className="inline-flex h-9 items-center justify-center rounded-full bg-white px-5 text-sm font-bold text-slate-950 hover:bg-cyan-50 transition-all hover:shadow-[0_0_15px_rgba(255,255,255,0.3)] transform hover:scale-105"
        >
          Get Started
        </a>
      </div>
    </div>
  </nav>
)
