import { BrowserRouter, Routes, Route } from 'react-router-dom'
import StartPage from './pages/StartPage.tsx'
import GamePage from './pages/GamePage.tsx'
import ResultPage from './pages/ResultPage.tsx'

function App() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
      <div className="w-[402px] h-[874px] bg-[#0a0a0f] overflow-y-auto scrollbar-hide shadow-2xl relative">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<StartPage />} />
            <Route path="/game" element={<GamePage />} />
            <Route path="/result" element={<ResultPage />} />
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  )
}

export default App
