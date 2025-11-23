export const TransparencySection = () => (
  <section className="py-24 bg-[#0B0F19] border-y border-white/5">
    <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
      <div className="space-y-8">
        <h2 className="text-3xl md:text-4xl font-bold text-white">
          Built for Developers.<br /><span className="text-slate-500">Transparent & Configurable.</span>
        </h2>
        <p className="text-lg text-slate-400 leading-relaxed">
          PolyPath isn't a black box. You get structured JSON outputs, verified code blocks, and full visibility into the agent's execution logs.
        </p>
        <div className="space-y-4">
          <div className="flex gap-4 items-start">
            <div className="mt-1 w-6 h-6 rounded-full bg-cyan-500/10 text-cyan-400 flex items-center justify-center text-sm font-bold">
              ✓
            </div>
            <div>
              <h3 className="font-bold text-white">Clarity at a Glance</h3>
              <p className="text-sm text-slate-400">Visualize complex tasks with structured roadmaps.</p>
            </div>
          </div>
          <div className="flex gap-4 items-start">
            <div className="mt-1 w-6 h-6 rounded-full bg-cyan-500/10 text-cyan-400 flex items-center justify-center text-sm font-bold">
              ✓
            </div>
            <div>
              <h3 className="font-bold text-white">Verifiable Steps</h3>
              <p className="text-sm text-slate-400">Ensure every step is accurate via Docker.</p>
            </div>
          </div>
        </div>
      </div>

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
          <p>
            <span className="text-purple-400">const</span> <span className="text-blue-400">agentConfig</span> = {'{'}
          </p>
          <p className="pl-4">
            environment: <span className="text-emerald-400">'E2B_Sandbox'</span>,
          </p>
          <p className="pl-4">containers: [</p>
          <p className="pl-8">
            <span className="text-emerald-400">'ghcr.io/puppeteer/puppeteer:latest'</span>,
          </p>
          <p className="pl-8">
            <span className="text-emerald-400">'node:18-alpine'</span>
          </p>
          <p className="pl-4">],</p>
          <p className="pl-4">
            memory: <span className="text-purple-400">new</span> <span className="text-yellow-400">VectorStore</span>(GeminiEmbeddings),
          </p>
          <p className="pl-4">
            timeout: <span className="text-orange-400">60000</span> <span className="text-slate-500">// 60s verification limit</span>
          </p>
          <p>{'};'}</p>
          <p className="mt-4">
            <span className="text-slate-500">// Executing verification swarm...</span>
          </p>
          <p>
            <span className="text-blue-400">await</span> agent.<span className="text-yellow-400">verify</span>(roadmap);
          </p>
        </div>
      </div>
    </div>
  </section>
)
