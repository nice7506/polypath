import {
  ArchitectureSection,
  EngineSection,
  LandingHero,
  LandingNavbar,
  PricingSection,
  TransparencySection,
  LandingFooter,
} from '@/components/landing'

export default function LandingPage() {
  return (
    <div className="bg-[#020617] text-slate-200 font-sans selection:bg-cyan-500/30 antialiased overflow-x-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;800&family=JetBrains+Mono:wght@400;700&display=swap');
        .font-mono { font-family: 'JetBrains Mono', monospace; }
        .perspective-1000 { perspective: 1000px; }
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: #020617; }
        ::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: #06b6d4; }
      `}</style>

      <LandingNavbar />
      <LandingHero />
      <ArchitectureSection />
      <EngineSection />
      <TransparencySection />
      <PricingSection />
      <LandingFooter />
    </div>
  )
}
