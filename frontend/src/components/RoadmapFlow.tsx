import { useMemo } from 'react'
import ReactFlow, { Background, Controls, type Edge, type Node } from 'reactflow'

import 'reactflow/dist/style.css'

type Week = {
  week?: number
  focus?: string
  resources?: { title: string; url?: string; summary?: string; type?: string }[]
}

type Props = {
  title: string
  weeks: Week[]
}

export function RoadmapFlow({ title, weeks }: Props) {
  const { nodes, edges } = useMemo(() => {
    const nodes: Node[] = []
    const edges: Edge[] = []

    const spacingX = 260
    const spacingY = 170

    const rootX = (Math.max(weeks.length, 1) - 1) * (spacingX / 2)
    nodes.push({
      id: 'root',
      data: { label: title },
      position: { x: rootX, y: 0 },
      style: {
        background: '#111118',
        color: '#fff',
        border: '1px solid #334155',
        padding: 12,
        borderRadius: 10,
      },
    })

    weeks.forEach((week, idx) => {
      const weekId = `week-${idx}`
      const x = idx * spacingX
      const y = spacingY
      nodes.push({
        id: weekId,
        data: { label: `Week ${week.week || idx + 1}${week.focus ? ` — ${week.focus}` : ''}` },
        position: { x, y },
        style: {
          background: '#0b1224',
          color: '#e2e8f0',
          border: '1px solid #1e293b',
          padding: 10,
          borderRadius: 10,
        },
      })
      edges.push({ id: `root-${weekId}`, source: 'root', target: weekId, animated: false })

      const resources = week.resources || []
      resources.forEach((res, rIdx) => {
        const resId = `${weekId}-res-${rIdx}`
        const rx = x + (rIdx - (resources.length - 1) / 2) * 140
        const ry = y + spacingY
        nodes.push({
          id: resId,
          data: { label: res.title },
          position: { x: rx, y: ry },
          style: {
            background: '#0f172a',
            color: '#cbd5e1',
            border: '1px solid #1e293b',
            padding: 8,
            borderRadius: 8,
            fontSize: 12,
            width: 180,
          },
        })
        edges.push({ id: `${weekId}-${resId}`, source: weekId, target: resId, animated: false })
      })
    })

    return { nodes, edges }
  }, [title, weeks])

  return (
    <div className="h-[520px] w-full rounded-2xl border border-gray-800 bg-[#05080f]">
      <ReactFlow nodes={nodes} edges={edges} fitView fitViewOptions={{ padding: 0.2 }}>
        <Background />
        <Controls showInteractive={false} />
      </ReactFlow>
    </div>
  )
}
