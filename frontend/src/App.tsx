import { Navigate, Route, BrowserRouter, Routes } from 'react-router-dom'

import AgentConsole from './pages/AgentConsole'
import Configuration from './pages/Configuration'
import Landing from './pages/landingPage'
import Roadmap from './pages/Roadmap'
import StrategyDeck from './pages/StrategyDeck'
import { RoadmapProvider } from './context/RoadmapContext'
import { AppLayout } from './components/AppLayout'

function App() {
  return (
    <BrowserRouter>
      <RoadmapProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route
            path="/start"
            element={
              <AppLayout>
                <Configuration />
              </AppLayout>
            }
          />
          <Route
            path="/select"
            element={
              <AppLayout>
                <StrategyDeck />
              </AppLayout>
            }
          />
          <Route
            path="/realization"
            element={
              <AppLayout>
                <AgentConsole />
              </AppLayout>
            }
          />
          <Route
            path="/roadmap"
            element={
              <AppLayout>
                <Roadmap />
              </AppLayout>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </RoadmapProvider>
    </BrowserRouter>
  )
}

export default App
