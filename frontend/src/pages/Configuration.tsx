import { useState } from 'react'
import { Rocket } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { useRoadmap } from '@/context/RoadmapContext'
import { draftStrategies } from '@/lib/api'

export default function Configuration() {
  const navigate = useNavigate()
  const { setConfig, setStrategies, setRoadmapId } = useRoadmap()
  const [topic, setTopic] = useState('')
  const [level, setLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Beginner')
  const [style, setStyle] = useState<string[]>(['Interactive'])
  const [hours, setHours] = useState<number[]>([20])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDraft = async () => {
    setError(null)
    setLoading(true)
    try {
      const payload = { topic, level, style: style.join(', '), hours: hours[0] }
      const data = await draftStrategies(payload)
      setConfig(payload)
      setStrategies(data.strategies || [])
      setRoadmapId(data.roadmapId || null)
      navigate('/select')
    } catch (err: any) {
      setError(err.message || 'Failed to generate strategies')
    } finally {
      setLoading(false)
    }
  }

  const toggleStyle = (s: string) => {
    setStyle((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]))
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0a0a0f] p-8 text-white">
      <div className="w-full max-w-2xl space-y-12">
        <div className="space-y-4 text-center">
          <h1 className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-6xl font-bold text-transparent">
            Build Your Perfect Learning Path.
          </h1>
          <p className="text-gray-400">Powered by E2B Agents &amp; Gemini RAG</p>
          <div className="flex justify-center gap-8 text-sm text-gray-500">
            <span className="font-bold text-purple-400">① Configuration</span>
            <span>/ ② Selection / ③ Realization</span>
          </div>
        </div>

        <div className="space-y-8 rounded-2xl border border-gray-800 bg-[#111118] p-8">
          <h2 className="text-2xl font-semibold">Configure Your Parameters</h2>

          <div className="space-y-6">
            <div>
              <Label>Topic</Label>
              <Input
                placeholder="e.g. Rust Programming"
                className="mt-2 border-gray-700 bg-[#1a1a22]"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
            </div>

            <div>
              <Label>Level</Label>
              <div className="mt-3 flex gap-4">
                {(['Beginner', 'Intermediate', 'Advanced'] as const).map((l) => (
                  <button
                    key={l}
                    onClick={() => setLevel(l)}
                    className={`rounded-lg px-6 py-3 transition ${level === l ? 'bg-purple-600' : 'bg-gray-800'}`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label>Style</Label>
              <div className="mt-3 flex flex-wrap gap-3">
                {['Video', 'Reading', 'Project', 'Interactive', 'Podcast'].map((s) => (
                  <button
                    key={s}
                    onClick={() => toggleStyle(s)}
                    className={`rounded-full px-5 py-2 text-sm transition ${
                      style.includes(s) ? 'bg-cyan-500 text-black' : 'bg-gray-800'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label>Time Commitment</Label>
              <div className="mt-4">
                <Slider defaultValue={hours} onValueChange={setHours} max={40} step={5} className="w-full" />
                <div className="mt-2 flex justify-between text-sm text-gray-400">
                  <span>5h</span>
                  <span className="text-cyan-400">{hours[0]} h/week</span>
                  <span>40h</span>
                </div>
              </div>
            </div>

            <Button
              onClick={handleDraft}
              disabled={loading}
              className="h-14 w-full bg-gradient-to-r from-cyan-500 to-purple-600 text-lg hover:from-cyan-400 hover:to-purple-500 disabled:opacity-50"
            >
              <Rocket className="mr-2" /> {loading ? 'Drafting...' : 'Draft Strategies'}
            </Button>
            {error && <p className="text-sm text-red-400">{error}</p>}
          </div>
        </div>
      </div>
    </div>
  )
}
