import { Navigate, Route, BrowserRouter, Routes } from 'react-router-dom'

import AgentConsole from './pages/AgentConsole'
import Configuration from './pages/Configuration'
import Landing from './pages/landingPage'
import Roadmap from './pages/Roadmap'
import StrategyDeck from './pages/StrategyDeck'
import SharedRoadmap from './pages/SharedRoadmap'
import AuthPage from './pages/Auth'
import Dashboard from './pages/Dashboard'
import { RoadmapProvider } from './context/RoadmapContext'
import { AppLayout } from './components/AppLayout'
import { ProtectedRoute } from './components/ProtectedRoute'

function App() {
  return (
    <BrowserRouter>
      <RoadmapProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route
            path="/start"
            element={
              <AppLayout>
                <Configuration />
              </AppLayout>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <Dashboard />
                </AppLayout>
              </ProtectedRoute>
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
          <Route
            path="/roadmap/:id"
            element={
              <AppLayout>
                <SharedRoadmap />
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
