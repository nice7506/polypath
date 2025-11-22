const featureItems: { title: string; desc: string }[] = [
  { title: 'Goal', desc: 'Defines the ultimate objective of your learning journey.' },
  { title: 'Learning Style', desc: 'Adapts content delivery to your preferred method.' },
  { title: 'Budget', desc: 'Tailors resources to fit your financial constraints.' },
  { title: 'Time/Week', desc: 'Schedules modules based on your weekly availability.' },
  { title: 'Current Skill Level', desc: "Calibrates the curriculum's starting point and difficulty." },
  { title: 'Device Specs', desc: 'Optimizes materials and tools for your hardware.' },
  { title: 'Preferred Tools', desc: 'Integrates with the software and platforms you already use.' },
  { title: 'Project Type', desc: 'Focuses the path on a specific real-world application.' },
  { title: 'Language Focus', desc: 'Prioritizes specific programming languages or frameworks.' },
  { title: 'Deadline', desc: 'Structures the path to ensure you meet your target date.' },
]

const agenticCards: { title: string; desc: string }[] = [
  {
    title: 'Secure Code Execution',
    desc: 'Isolated E2B Sandboxes provide a safe environment for agents to run code, test solutions, and validate learning paths in real-time.',
  },
  {
    title: 'Replicable Environments',
    desc: 'Docker ensures consistent, version-controlled environments for every learning module, eliminating configuration issues.',
  },
  {
    title: 'Intelligent Knowledge Retrieval',
    desc: 'Gemini RAG lets agents pull the most relevant, up-to-date information to construct effective learning steps.',
  },
]

const commandBullets: { title: string; desc: string }[] = [
  { title: 'Clarity at a Glance', desc: 'Visualize complex developer tasks with structured roadmaps, eliminating ambiguity.' },
  { title: 'Verifiable Steps', desc: 'Ensure every step is accurate with real-time verification against live web data.' },
  { title: 'Exportable Data', desc: 'Get predictable, structured outputs like JSON and code blocks, ready for integration.' },
]

const ctaStates: string[] = ['Draft Your Roadmap', 'Initializing Agents...', 'Roadmap Ready!', 'Agent Failed: Retry']

export default function Landing() {
  return (
    <div className="bg-[#020617] text-white">
      {/* Hero */}
      <div className="relative flex min-h-screen w-full flex-col overflow-hidden">
        <div
          className="absolute inset-0 z-0 opacity-10"
          style={{
            backgroundImage:
              'radial-gradient(circle at 25% 25%, #2547f4 0%, transparent 30%), radial-gradient(circle at 75% 75%, #a855f7 0%, transparent 30%)',
          }}
        />
        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <header className="flex items-center justify-between py-6">
            <div className="flex items-center gap-3">
              <div className="h-6 w-6 text-white">
                <svg fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                  <path
                    clipRule="evenodd"
                    d="M12.0799 24 4 19.2479 9.95537 8.75216 18.04 13.4961 18.0446 4H29.9554L29.96 13.4961 38.0446 8.75216 44 19.2479 35.92 24 44 28.7521 38.0446 39.2479 29.96 34.5039 29.9554 44H18.0446L18.04 34.5039 9.95537 39.2479 4 28.7521 12.0799 24Z"
                    fillRule="evenodd"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-bold tracking-tight">PolyPath</h2>
            </div>
            <nav className="hidden items-center gap-8 md:flex">
              {['Features', 'Pricing', 'Docs', 'Blog'].map((item) => (
                <a key={item} className="text-sm font-medium text-slate-300 transition-colors hover:text-white" href="#">
                  {item}
                </a>
              ))}
            </nav>
            <div className="flex items-center gap-3">
              <button className="flex h-10 min-w-[84px] items-center justify-center rounded-lg bg-slate-800 px-4 text-sm font-bold transition hover:bg-slate-700">
                Sign In
              </button>
              <button className="hidden h-10 min-w-[84px] items-center justify-center rounded-lg bg-[#2547f4] px-4 text-sm font-bold transition hover:bg-blue-600 sm:flex">
                Sign Up
              </button>
            </div>
          </header>
        </div>

        <main className="relative z-10 flex flex-1 items-center">
          <div className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
              <div className="flex flex-col gap-8">
                <div className="flex flex-col gap-4">
                  <h1 className="bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400 bg-clip-text text-5xl font-black tracking-tighter text-transparent sm:text-6xl md:text-7xl">
                    Stop Guessing. Start Learning.
                  </h1>
                  <p className="max-w-xl text-lg text-slate-300">
                    Generate hyper-personalized curriculums powered by Autonomous Agents, E2B Sandboxes, and Live Web Verification.
                  </p>
                </div>
                <div className="flex">
                  <a
                    className="group inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-[#2547f4] px-6 text-base font-bold text-white shadow-lg shadow-blue-500/20 transition duration-200 hover:scale-105 hover:shadow-blue-500/40 active:scale-95"
                    href="#"
                  >
                    <span>Draft Your Roadmap</span>
                    <span className="material-symbols-outlined transition-transform duration-300 group-hover:translate-x-1">arrow_right_alt</span>
                  </a>
                </div>
              </div>

              <div className="flex items-center justify-center lg:justify-end">
                <div className="w-full max-w-2xl rounded-xl border border-slate-700/80 bg-slate-900/60 p-4 shadow-2xl shadow-black/50 backdrop-blur-sm">
                  <div className="flex h-8 items-center gap-2 border-b border-slate-700/80 px-4 pb-4">
                    <div className="h-3 w-3 rounded-full bg-red-500" />
                    <div className="h-3 w-3 rounded-full bg-yellow-500" />
                    <div className="h-3 w-3 rounded-full bg-green-500" />
                  </div>
                  <div className="terminal-code min-h-[192px] p-4 font-mono text-sm text-slate-300">
                    <span>
                      <span className="text-emerald-400 mr-2">&gt;</span>user_profile detected: {`{`} topic:{' '}
                      <span className="text-purple-400">"Rust"</span>, level: <span className="text-purple-400">"Advanced"</span> {`}`}
                    </span>
                    <span>
                      <span className="text-emerald-400 mr-2">&gt;</span>spawning_agent: E2B_Sandbox_01...{' '}
                      <span className="text-blue-400">[OK]</span>
                    </span>
                    <span>
                      <span className="text-emerald-400 mr-2">&gt;</span>docker_run: ghcr.io/puppeteer...{' '}
                      <span className="text-blue-400">[OK]</span>
                    </span>
                    <span>
                      <span className="text-emerald-400 mr-2">&gt;</span>compiling_roadmap...
                    </span>
                    <span>
                      <span aria-hidden="true" className="ml-2 inline-block h-4 w-2 animate-pulse bg-emerald-400" />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Features */}
      <section className="bg-[#101322] py-16 sm:py-20 lg:py-24">
        <div className="mx-auto flex w/full max-w-7xl flex-col items-center gap-16 px-4 sm:px-6 lg:px-8 lg:flex-row lg:items-start lg:gap-10">
          <div className="flex w-full flex-col gap-6 lg:w-1/2 lg:sticky lg:top-16">
            <div className="flex flex-col gap-4">
              <p className="font-bold uppercase tracking-widest text-[#2547f4]">10-Point Precision</p>
              <h2 className="text-4xl font-bold leading-tight text-white md:text-5xl">Beyond the Prompt: Your Personalized AI Learning Agent.</h2>
              <p className="text-lg text-slate-300">
                PolyPath goes deeper than a single prompt. We use ten specific data points to create a truly tailored learning path, leading to
                faster and more effective results.
              </p>
            </div>
            <button className="h-12 w-fit rounded-lg bg-[#2547f4] px-5 text-base font-bold text-white transition hover:bg-[#1f3cc8]">
              See All Features
            </button>
          </div>

          <div className="grid w-full grid-cols-2 gap-4 lg:w-1/2">
            {featureItems.map((item) => (
              <div
                key={item.title}
                className="group flex flex-col gap-3 rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm transition hover:border-[#2547f4]/50 hover:bg-[#2547f4]/10"
              >
                <div className="text-lg text-[#2547f4]">●</div>
                <div className="flex flex-col gap-1">
                  <h3 className="text-base font-bold leading-tight text-white">{item.title}</h3>
                  <p className="text-sm leading-normal text-gray-300">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Agentic core */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#1c1022] via-[#1c1022] to-[#101322] px-4 py-16 sm:px-6 sm:py-20 md:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#a60df2_0%,_transparent_50%)] opacity-20" />
        <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center text-center">
          <h2 className="text-3xl font-bold leading-tight text-white sm:text-4xl md:text-5xl">The Agentic Core of Your Learning</h2>
          <p className="mt-4 max-w-3xl text-base leading-normal text-gray-300 sm:text-lg">
            Discover how PolyPath's core technologies combine to create hyper-personalized, dynamic learning roadmaps tailored just for you.
          </p>
          <div className="my-12 flex h-48 w-48 items-center justify-center rounded-full bg-[#a60df2]/10 p-4 ring-1 ring-[#a60df2]/20 backdrop-blur-sm sm:h-64 sm:w-64">
            <img
              className="h-full w-full rounded-full object-cover mix-blend-lighten opacity-80"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCDXWTVxqSTg_Q_e9ZtmU5iZ697co3_gyHmjYzERzDUBm1Tb5STydsc-T37pj1mTgIRLX_iEOAGSPnYWCBrP43HFMQ0z2WLayfB39QIhDzvIUh83slRChy7GoddMbaIveOi9_XI9NTJNo0JM-B75-aUyn7tudwmWv7Tql_qE2S33RuCma87VgHDYxQjtO7Khti1K5rEqrvBF6aSx6NeCpV39TDFqCsly4oKU7RnBsogss3sTwflWwoLacjAHhqKonbwe0aUWwOE5co"
              alt="Abstract swirling purple and blue light trails representing an AI neural network."
            />
          </div>
          <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-3">
            {agenticCards.map((card) => (
              <div
                key={card.title}
                className="flex flex-col gap-4 rounded-xl border border-[#a60df2]/20 bg-[#1c1022]/70 p-6 backdrop-blur-lg transition hover:border-[#a60df2]/40 hover:bg-[#1c1022]/80"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#a60df2]/20 text-[#a60df2]">★</div>
                <div className="flex flex-col gap-1">
                  <h3 className="text-lg font-bold leading-tight text-white">{card.title}</h3>
                  <p className="text-sm leading-normal text-gray-300">{card.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Command center */}
      <section className="bg-[#101322] px-4 py-16 sm:px-6 sm:py-20 md:py-24">
        <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="relative overflow-hidden rounded-xl border border-white/10 bg-[#1A1D24]/90 p-6 shadow-xl backdrop-blur">
            <img
              alt="Developer workflow visualization"
              className="absolute inset-0 h-full w-full object-cover opacity-90"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDd1M2UXszDEDxFY0kNd3f2YRc7-oecStQJJz7ZUvAIXE46TWVze-Ti2JxLVwFZi6lhS4mRWBy-iNSgTM4p-SiZksmxYhqzZx5lkLukTAHtPl18RkDzdvzNIrE-OdgxRQzCoGtBwNChGwm3qfgdTrLmUzKDw6OyfubPCgtamH8unGRb0bf22undZ2RrRCF6_qPHmbvjLaLQoAYyVEU2-BUXVLdLXdYrxK_V6pb-IGjYrQWxjLRW8p_96-CqEGQXo4ISn9ygxMMZFd8"
            />
            <div className="relative flex h-full flex-col justify-between">
              <div className="flex items-center gap-2 self-start rounded-full border border-pink-400/60 bg-pink-500/15 px-4 py-2 text-sm font-medium text-pink-200 shadow-lg backdrop-blur-sm">
                <span className="text-base">✔</span>
                <span>Live Web Verification</span>
              </div>
              <div className="flex items-center gap-2 self-end rounded-full border border-pink-400/60 bg-pink-500/15 px-4 py-2 text-sm font-medium text-pink-200 shadow-lg backdrop-blur-sm">
                <span className="text-base">⇄</span>
                <span>Structured Output</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-center gap-8 py-4">
            <div className="flex flex-col gap-4">
              <h2 className="text-4xl font-bold tracking-tight text-[#00F5D4] sm:text-5xl">The Command Center: Beyond Chat.</h2>
              <p className="max-w-prose text-base leading-relaxed text-white/80 md:text-lg">
                PolyPath moves past conversational ambiguity, offering structured, visual, and verifiable agentic workflows for complex
                developer tasks. Experience a superior workflow with structured data visualization and rich animations.
              </p>
            </div>
            <div className="space-y-4 border-l-2 border-[#9B5DE5]/50 pl-6">
              {commandBullets.map((item) => (
                <div key={item.title} className="flex items-start gap-4">
                  <div className="mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#9B5DE5]/20 text-[#9B5DE5]">✦</div>
                  <div>
                    <h3 className="font-bold text-white">{item.title}</h3>
                    <p className="text-sm text-white/70">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-fit cursor-pointer items-center justify-center rounded-lg bg-[#00F5D4] px-6 py-3 text-base font-bold text-black shadow-[0_4px_14px_0_rgb(0,245,212,0.39)] transition hover:shadow-[0_6px_20px_0_rgb(0,245,212,0.23)]">
              See It in Action
            </button>
          </div>
        </div>
      </section>

      {/* CTA states */}
      <section className="bg-[#101322] px-4 pb-16 sm:px-6 sm:pb-20 md:pb-24">
        <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-6 text-center">
          <h2 className="text-4xl font-bold tracking-tight text-white">PolyPath: Your Agentic Learning Platform</h2>
          <p className="max-w-2xl text-lg text-neutral-300">
            Our AI agents will build a personalized learning path based on your goals. Launch your journey now or explore the button states below.
          </p>
          <button className="relative flex items-center justify-center gap-2 rounded-lg border-2 border-transparent bg-gradient-to-r from-cyan-400 to-fuchsia-500 px-8 py-3 text-xl font-bold tracking-wide text-white shadow-lg transition hover:scale-105">
            Draft Your Roadmap
          </button>
          <div className="flex flex-wrap justify-center gap-3 rounded-lg bg-white/5 p-4 text-sm text-slate-200">
            {ctaStates.map((state) => (
              <span key={state} className="rounded-md bg-white/10 px-4 py-2 transition hover:bg-white/20">
                {state}
              </span>
            ))}
          </div>
          <div className="grid w-full max-w-3xl gap-4 rounded-2xl border border-white/10 bg-white/5 p-6 shadow-xl">
            {ctaStates.map((label, idx) => (
              <button
                key={label}
                className={`relative flex w-full items-center justify-center gap-2 rounded-lg px-5 py-3 text-base font-semibold transition ${
                  idx === 0
                    ? 'bg-cyan-400 text-slate-950 shadow-[0_4px_14px_0_rgba(34,211,238,0.35)]'
                    : idx === 1
                      ? 'border border-cyan-300 bg-cyan-500/10 text-cyan-100'
                      : idx === 2
                        ? 'border border-emerald-300 bg-emerald-500/10 text-emerald-100'
                        : 'border border-rose-300 bg-rose-500/10 text-rose-100'
                }`}
              >
                {idx === 1 && <span className="absolute bottom-0 left-0 h-1 w-full animate-pulse bg-cyan-400" />}
                {idx === 2 && <span className="text-emerald-200">✓</span>}
                {idx === 3 && <span className="text-rose-200">!</span>}
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-slate-950/80 backdrop-blur">
        <div className="container mx-auto max-w-6xl px-6 py-16">
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <div className="flex items-center gap-3">
                <svg fill="none" height="32" viewBox="0 0 32 32" width="32" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M11 25.3333C13.9455 25.3333 16.3333 22.9455 16.3333 20C16.3333 17.0545 13.9455 14.6667 11 14.6667C8.05452 14.6667 5.66667 17.0545 5.66667 20C5.66667 22.9455 8.05452 25.3333 11 25.3333Z"
                    stroke="#58A6FF"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  />
                  <path
                    d="M21 17.3333C23.9455 17.3333 26.3333 14.9455 26.3333 12C26.3333 9.05452 23.9455 6.66666 21 6.66666C18.0545 6.66666 15.6667 9.05452 15.6667 12C15.6667 14.9455 18.0545 17.3333 21 17.3333Z"
                    stroke="#58A6FF"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  />
                  <path d="M15.8267 14.16 11.5133 17.84" stroke="#58A6FF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                </svg>
                <span className="text-2xl font-bold tracking-wider text-white">PolyPath</span>
              </div>
              <p className="mt-4 text-gray-400">
                An agentic learning platform designed by developers, for developers, to build and deploy autonomous agents.
              </p>
              <div className="mt-6 flex gap-4">
                {['GitHub', 'Twitter', 'Discord'].map((link) => (
                  <a key={link} className="text-gray-400 transition hover:text-[#58A6FF]" href="#">
                    {link}
                  </a>
                ))}
              </div>
            </div>

            <div className="lg:col-span-8 grid grid-cols-2 gap-8 md:grid-cols-3">
              {[
                { title: 'Product', links: ['Features', 'Pricing', 'Use Cases', 'Documentation'] },
                { title: 'Company', links: ['About Us', 'Careers', 'Blog', 'Contact'] },
                { title: 'Resources', links: ['Tutorials', 'API Reference', 'Community', 'Status Page'] },
              ].map((section) => (
                <div key={section.title}>
                  <h4 className="text-lg font-semibold text-white">{section.title}</h4>
                  <ul className="mt-4 space-y-3">
                    {section.links.map((link) => (
                      <li key={link}>
                        <a className="text-gray-400 transition hover:text-[#58A6FF] hover:underline" href="#">
                          {link}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
          <hr className="my-10 border-gray-700" />
          <div className="flex flex-col items-center justify-between gap-4 text-sm text-gray-500 sm:flex-row">
            <div>
              <p>© 2024 PolyPath Inc.</p>
              <p className="mt-1">Powered by E2B, Docker, and Gemini.</p>
            </div>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
              <a className="text-gray-400 transition hover:text-[#58A6FF] hover:underline" href="#">
                Terms of Service
              </a>
              <a className="text-gray-400 transition hover:text-[#58A6FF] hover:underline" href="#">
                Privacy Policy
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
