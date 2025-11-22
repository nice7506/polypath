import { createContext, useContext, useState, type ReactNode } from 'react'

interface RoadmapContextType {
  config: any
  strategies: any[]
  selectedStrategy: any
  logs: string[]
  roadmap: any
  sandboxId: string | null
  setConfig: (c: any) => void
  setStrategies: (s: any[]) => void
  setSelectedStrategy: (s: any) => void
  addLog: (log: string) => void
  setRoadmap: (r: any) => void
  setSandboxId: (id: string) => void
}

const RoadmapContext = createContext<RoadmapContextType | undefined>(undefined)

export const RoadmapProvider = ({ children }: { children: ReactNode }) => {
  const [config, setConfig] = useState<any>(null)
  const [strategies, setStrategies] = useState<any[]>([])
  const [selectedStrategy, setSelectedStrategy] = useState<any>(null)
  const [logs, setLogs] = useState<string[]>([])
  const [roadmap, setRoadmap] = useState<any>(null)
  const [sandboxId, setSandboxId] = useState<string | null>(null)

  const addLog = (log: string) => setLogs((prev) => [...prev, log])

  return (
    <RoadmapContext.Provider
      value={{
        config,
        setConfig,
        strategies,
        setStrategies,
        selectedStrategy,
        setSelectedStrategy,
        logs,
        addLog,
        roadmap,
        setRoadmap,
        sandboxId,
        setSandboxId,
      }}
    >
      {children}
    </RoadmapContext.Provider>
  )
}

export const useRoadmap = () => {
  const context = useContext(RoadmapContext)
  if (!context) throw new Error('useRoadmap must be used within RoadmapProvider')
  return context
}
