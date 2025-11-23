import { architecture, featureItems, bgNoise } from './constants'

export const ArchitectureSection = () => (
  <section id="architecture" className="py-24 border-y border-white/5 bg-[#050811] relative overflow-hidden">
    <div className="absolute inset-0" style={{ backgroundImage: bgNoise }}></div>
    <div className="max-w-7xl mx-auto px-6 relative z-10">
      <div className="text-center mb-20">
        <h2 className="text-3xl font-bold text-white">The Architecture</h2>
        <p className="text-slate-400 mt-2 text-lg">How PolyPath turns simple prompts into verified, actionable knowledge.</p>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center gap-8 relative">
        <div className="hidden md:block absolute top-10 left-0 w-full h-0.5 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-emerald-500/20 -z-10"></div>
        {architecture.map((step, idx) => (
          <div
            key={idx}
            className={`flex-1 rounded-2xl border border-white/10 bg-white/[0.02] p-6 text-center shadow-lg hover:-translate-y-1 transition-all duration-300`}
          >
            <div className="mb-3 text-2xl">{step.emoji}</div>
            <h3 className="text-lg font-semibold text-white mb-2">{step.title}</h3>
            <p className="text-sm text-slate-400">{step.sub}</p>
          </div>
        ))}
      </div>

      <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {featureItems.map((item) => (
          <div
            key={item.id}
            className="group p-5 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-cyan-500/30 transition-all duration-300 hover:-translate-y-1"
          >
            <div className="text-xs font-mono text-cyan-500 mb-3">{item.id}</div>
            <h3 className="text-white font-bold mb-2">{item.title}</h3>
            <p className="text-sm text-slate-400">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
)
