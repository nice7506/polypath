import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type RoadmapState = {
  config: any
  strategies: any[]
  selectedStrategy: any
  logs: string[]
  roadmap: any
  agentRoadmaps: any[]
  selectedAgentId: string | null
  sandboxId: string | null
  roadmapId: string | null
  isRealizing: boolean
}

type RoadmapActions = {
  setConfig: (c: any) => void
  setStrategies: (s: any[]) => void
  setSelectedStrategy: (s: any) => void
  addLog: (log: string) => void
  setLogs: (logs: string[]) => void
  setRoadmap: (r: any) => void
  setAgentRoadmaps: (list: any[]) => void
  setSelectedAgentId: (id: string | null) => void
  setSandboxId: (id: string | null) => void
  setRoadmapId: (id: string | null) => void
  setIsRealizing: (value: boolean) => void
  reset: () => void
}

const initialState: RoadmapState = {
  config: null,
  strategies: [],
  selectedStrategy: null,
  logs: [],
  roadmap: null,
  agentRoadmaps: [],
  selectedAgentId: null,
  sandboxId: null,
  roadmapId: null,
  isRealizing: false,
}

export const useRoadmapStore = create<RoadmapState & RoadmapActions>()(
  persist(
    (set) => ({
      ...initialState,
      setConfig: (config) => set({ config }),
      setStrategies: (strategies) => set({ strategies }),
      setSelectedStrategy: (selectedStrategy) => set({ selectedStrategy }),
      addLog: (log) => set((state) => ({ logs: [...state.logs, log] })),
      setLogs: (logs) => set({ logs }),
      setRoadmap: (roadmap) => set({ roadmap }),
      setAgentRoadmaps: (agentRoadmaps) => set({ agentRoadmaps }),
      setSelectedAgentId: (selectedAgentId) => set({ selectedAgentId }),
      setSandboxId: (sandboxId) => set({ sandboxId }),
      setRoadmapId: (roadmapId) => set({ roadmapId }),
      setIsRealizing: (isRealizing) => set({ isRealizing }),
      reset: () => set(initialState),
    }),
    {
      name: 'roadmap-store',
    }
  )
)
