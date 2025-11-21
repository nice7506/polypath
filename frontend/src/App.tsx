import { ArrowRight, Layers, Server, Sparkles } from 'lucide-react'

import { Button } from '@/components/ui/button'

const modules = [
  {
    title: 'Frontend',
    description: 'React + Vite scaffolded with Tailwind and shadcn/ui tokens ready to go.',
    icon: Layers,
    highlights: [
      'Tailwind configured with theme tokens and animations',
      'Alias support for clean imports (@/...)',
      'shadcn/ui Button component wired with cn() helper',
    ],
  },
  {
    title: 'Backend',
    description: 'Node workspace ready for Express or your framework of choice.',
    icon: Server,
    highlights: [
      'Isolated workspace with its own scripts',
      'Ready for API routing, auth, and integrations',
      'Shared root scripts for quick starts',
    ],
  },
]

function App() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="container space-y-12 py-12">
        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-8 py-10 text-slate-50 shadow-xl sm:px-12">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold tracking-tight text-white/80 ring-1 ring-white/20">
                <Sparkles className="size-4" />
                <span>Monorepo ready: React + Tailwind + shadcn/ui + Node</span>
              </div>
              <div className="space-y-2">
                <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
                  Polypath starter kit
                </h1>
                <p className="max-w-2xl text-sm text-slate-200 sm:text-base">
                  Jump straight into building product features. Frontend and backend live side by
                  side with sensible defaults and shareable tooling.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button
                  variant="secondary"
                  className="bg-white text-slate-900 shadow-lg hover:bg-white/90"
                >
                  Open frontend <ArrowRight className="ml-2 size-4" />
                </Button>
                <Button
                  variant="outline"
                  className="border-white/40 text-white hover:bg-white/10 hover:text-white"
                >
                  Backend workspace
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-2">
          {modules.map(({ title, description, icon: Icon, highlights }) => (
            <article
              key={title}
              className="h-full rounded-2xl border border-border bg-card/70 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex items-center gap-3">
                <span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="size-5" />
                </span>
                <div>
                  <h2 className="text-lg font-semibold">{title}</h2>
                  <p className="text-sm text-muted-foreground">{description}</p>
                </div>
              </div>
              <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
                {highlights.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-1 inline-block size-2 rounded-full bg-primary" />
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </section>

        <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            <Sparkles className="size-4" />
            Quick start
          </div>
          <ol className="mt-4 space-y-3 text-sm text-muted-foreground">
            <li className="flex gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-semibold">
                1
              </span>
              <div>
                <p className="font-medium text-foreground">Install dependencies</p>
                <p>Run the workspace-aware install: npm install</p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-semibold">
                2
              </span>
              <div>
                <p className="font-medium text-foreground">Start building</p>
                <p>Frontend dev server: npm run dev:frontend</p>
                <p>Backend dev server: npm run dev:backend</p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-semibold">
                3
              </span>
              <div>
                <p className="font-medium text-foreground">Add UI primitives</p>
                <p className="leading-relaxed">
                  Drop new shadcn/ui components into <code className="rounded bg-muted px-1">src/components</code>{' '}
                  and style with Tailwind tokens.
                </p>
              </div>
            </li>
          </ol>
        </section>
      </div>
    </main>
  )
}

export default App
