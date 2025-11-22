import { Pencil } from 'lucide-react'

import { Button } from '@/components/ui/button'

export default function Roadmap() {
  const resources = [
    {
      type: 'VIDEO',
      title: 'Official Redux Toolkit Tutorial',
      url: 'https://redux-toolkit.js.org/tutorials/overview',
    },
    {
      type: 'DOC',
      title: 'Zustand Documentation',
      url: 'https://github.com/pmndrs/zustand',
    },
  ]

  return (
    <div className="flex min-h-screen bg-black text-white">
      <div className="w-64 space-y-8 border-r border-gray-800 bg-[#0f0f18] p-6">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500" />
          <div>
            <div className="font-bold">PolyPath</div>
            <div className="text-sm text-gray-400">AI Learning Architect</div>
          </div>
        </div>

        <nav className="space-y-4 text-sm">
          <div className="text-gray-500">Configuration</div>
          <div className="text-gray-500">Selection</div>
          <div className="font-bold text-purple-400">Realization</div>
        </nav>
      </div>

      <div className="flex-1 p-12">
        <div className="mx-auto flex max-w-4xl flex-col space-y-12">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold">Advanced React State Management</h1>
              <div className="mt-2 text-lg text-green-400">● VERIFIED SOURCE: LIVE WEB</div>
            </div>
          </div>

          <div className="space-y-8">
            {[1, 2, 3].map((week) => (
              <div key={week} className="border-b border-gray-800 pb-8">
                <h3 className="mb-6 text-xl font-semibold">WEEK {week}</h3>
                <div className="space-y-6">
                  {resources.map((r, i) => (
                    <div
                      key={`${r.title}-${i}`}
                      className="flex gap-6 rounded-2xl border border-gray-800 bg-[#111118] p-6"
                    >
                      <div
                        className={`h-32 w-32 rounded-xl bg-gradient-to-br ${
                          i === 0 ? 'from-cyan-500 to-purple-600' : 'from-green-500 to-cyan-500'
                        }`}
                      />
                      <div className="flex-1 space-y-3">
                        <div className="text-sm text-cyan-400">[{r.type}]</div>
                        <h4 className="text-xl font-semibold">{r.title}</h4>
                        <p className="text-gray-400">An introductory video series covering the fundamentals...</p>
                        <a className="text-sm text-purple-400" href={r.url}>
                          Show Gemini Summary →
                        </a>
                        <br />
                        <a className="text-sm text-blue-400 underline" href={r.url} target="_blank" rel="noreferrer">
                          {r.url}
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <Button className="fixed bottom-8 right-8 h-16 w-16 rounded-full bg-purple-600 shadow-2xl hover:bg-purple-500">
            <Pencil className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </div>
  )
}
