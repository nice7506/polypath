const tiers = [
  {
    name: 'Starter',
    price: 'Free',
    cta: 'Get Started',
    desc: 'For trying the flow and drafting initial strategies.',
    perks: ['1 active roadmap', 'Gemini text only', 'Community support'],
    highlight: false,
  },
  {
    name: 'Pro',
    price: '$19/mo',
    cta: 'Upgrade to Pro',
    desc: 'For power users who need sandboxed verification.',
    perks: ['Unlimited roadmaps', 'E2B sandbox + Docker MCP', 'Resume/jobs module', 'Priority support'],
    highlight: true,
  },
  {
    name: 'Team',
    price: 'Contact',
    cta: 'Talk to us',
    desc: 'For orgs that need collaboration and SSO.',
    perks: ['Shared workspaces', 'SSO + audit logs', 'Custom MCP runners', 'Slack/Email support'],
    highlight: false,
  },
]

export const PricingSection = () => (
  <section id="pricing" className="py-24 bg-[#020617]">
    <div className="max-w-6xl mx-auto px-6">
      <h2 className="text-3xl font-bold text-center text-white mb-4">Pricing</h2>
      <p className="text-center text-slate-400 mb-12">Pick the plan that fits your build cycle.</p>
      <div className="grid gap-6 md:grid-cols-3">
        {tiers.map((tier) => (
          <div
            key={tier.name}
            className={`rounded-2xl border border-white/10 bg-[#0F1117]/80 p-8 shadow-xl ${
              tier.highlight ? 'ring-2 ring-cyan-500 shadow-cyan-500/20' : ''
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">{tier.name}</h3>
              {tier.highlight && (
                <span className="rounded-full bg-cyan-500/10 border border-cyan-500/30 px-2 py-0.5 text-[10px] font-semibold text-cyan-300">
                  Recommended
                </span>
              )}
            </div>
            <div className="text-3xl font-bold text-white mb-2">{tier.price}</div>
            <p className="text-sm text-slate-400 mb-6">{tier.desc}</p>
            <div className="space-y-2 mb-6 text-sm text-slate-200">
              {tier.perks.map((perk) => (
                <div key={perk} className="flex items-center gap-2">
                  <span className="text-cyan-400">✓</span>
                  <span>{perk}</span>
                </div>
              ))}
            </div>
            <a
              href="/start"
              className={`inline-flex w-full items-center justify-center rounded-lg px-4 py-3 text-sm font-semibold transition-all ${
                tier.highlight
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-cyan-500/30 hover:shadow-cyan-500/50 hover:scale-[1.01]'
                  : 'border border-white/10 text-white hover:border-cyan-500/40 hover:text-cyan-200'
              }`}
            >
              {tier.cta}
            </a>
          </div>
        ))}
      </div>
    </div>
  </section>
)
