import { BookOpen, Circle, Wrench, Zap } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { useRoadmap } from '@/context/RoadmapContext'

const strategies = [
  { name: 'Aggressive Strategy', color: 'red', weeks: 3, icon: Zap },
  { name: 'Academic Strategy', color: 'blue', weeks: 8, icon: BookOpen },
  { name: 'Project-Based Strategy', color: 'green', weeks: 6, icon: Wrench },
  { name: 'Minimalist Strategy', color: 'gray', weeks: 2, icon: Circle },
]

export default function StrategyDeck() {
  const navigate = useNavigate()
  const { setSelectedStrategy, addLog } = useRoadmap()

  const handleSelect = (strategy: (typeof strategies)[number]) => {
    setSelectedStrategy(strategy)
    addLog('> Initializing E2B Sandbox environment...')
    addLog('> Docker: Pulling image [poly-agent:latest]...')
    navigate('/realization')
  }

  const bgClass = (color: string) => {
    switch (color) {
      case 'red':
        return 'bg-red-900/30 border-red-800'
      case 'blue':
        return 'bg-blue-900/30 border-blue-800'
      case 'green':
        return 'bg-green-900/30 border-green-800'
      default:
        return 'bg-gray-900/50 border-gray-700'
    }
  }

  const buttonClass = (color: string) => {
    switch (color) {
      case 'red':
        return 'bg-red-600 hover:bg-red-500'
      case 'blue':
        return 'bg-blue-600 hover:bg-blue-500'
      case 'green':
        return 'bg-green-600 hover:bg-green-500'
      default:
        return 'bg-gray-600 hover:bg-gray-500'
    }
  }

  const iconBg = (color: string) => {
    switch (color) {
      case 'red':
        return 'bg-red-600'
      case 'blue':
        return 'bg-blue-600'
      case 'green':
        return 'bg-green-600'
      default:
        return 'bg-gray-700'
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      <div className="p-8 text-sm text-gray-500">Configuration / Selection / Realization</div>
      <div className="flex flex-1 items-center justify-center px-12">
        <div className="w-full max-w-7xl space-y-12">
          <div className="space-y-4 text-center">
            <h1 className="text-6xl font-bold">The Strategy Deck</h1>
            <p className="text-lg text-gray-400">
              Review the generated strategies and select one to initialize your learning agents.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {strategies.map((s) => {
              const Icon = s.icon
              return (
                <div key={s.name} className={`rounded-2xl border p-8 backdrop-blur ${bgClass(s.color)}`}>
                  <div className="mb-6 flex items-center gap-4">
                    <div className={`rounded-lg p-3 ${iconBg(s.color)}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-2xl font-bold">{s.name}</h3>
                  </div>
                  <p className="mb-8 text-gray-300">Why this fits you: An approach focused on...</p>
                  <div className="mb-6 flex items-center justify-between">
                    <div>
                      <div className="text-sm text-gray-500">ESTIMATED TIME</div>
                      <div className="text-2xl font-bold">{s.weeks} Weeks</div>
                    </div>
                    <div className="rounded-full bg-gray-800 px-4 py-2 text-sm">Links: 0 (Draft)</div>
                  </div>
                  <Button onClick={() => handleSelect(s)} className={`h-12 w-full ${buttonClass(s.color)}`}>
                    Select &amp; Initialize Agents
                  </Button>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
