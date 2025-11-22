import { type ReactNode } from 'react'

import { Sidebar } from '@/components/Sidebar'

export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#05080f] text-white">
      <Sidebar />
      <main className="flex-1 bg-gradient-to-br from-[#0a0f1f] via-[#05080f] to-[#0f172a] p-8">
        <div className="mx-auto max-w-6xl">{children}</div>
      </main>
    </div>
  )
}
