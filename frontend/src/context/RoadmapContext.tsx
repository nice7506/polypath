import { type ReactNode } from 'react'

import { useRoadmapStore } from '@/store/roadmapStore'

// The provider is now a simple passthrough since Zustand handles state.
export const RoadmapProvider = ({ children }: { children: ReactNode }) => <>{children}</>

export const useRoadmap = useRoadmapStore
