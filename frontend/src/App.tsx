import { Navigate, Route, BrowserRouter, Routes } from 'react-router-dom'

import AgentConsole from './pages/AgentConsole'
import Configuration from './pages/Configuration'
import Landing from './pages/landingPage'
import Roadmap from './pages/Roadmap'
import StrategyDeck from './pages/StrategyDeck'
import { RoadmapProvider } from './context/RoadmapContext'

function App() {
  return (
    <BrowserRouter>
      <RoadmapProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/start" element={<Configuration />} />
          <Route path="/select" element={<StrategyDeck />} />
          <Route path="/realization" element={<AgentConsole />} />
          <Route path="/roadmap" element={<Roadmap />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </RoadmapProvider>
    </BrowserRouter>
  )
}

export default App
