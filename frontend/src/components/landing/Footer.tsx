export const LandingFooter = () => (
  <footer className="py-12 border-t border-white/5 bg-[#020617]">
    <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-400">
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold shadow-lg shadow-cyan-500/20">
          P
        </div>
        <span className="text-white font-semibold">PolyPath</span>
        <span className="text-slate-500">© {new Date().getFullYear()}</span>
      </div>
      
      <div className="text-xs text-slate-500">Built with E2B, Docker MCP, Gemini.</div>
    </div>
  </footer>
)
