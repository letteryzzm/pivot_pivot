import { BrowserRouter, Routes, Route } from 'react-router-dom';
import StatBar from './components/StatBar';
import StartPage from './pages/StartPage';
import GamePage from './pages/GamePage';
import ActivitySelectPage from './pages/ActivitySelectPage';
import ResultPage from './pages/ResultPage';
import FeedbackPage from './pages/FeedbackPage';
import ReflectPage from './pages/ReflectPage';
import LegalBreakPage from './pages/LegalBreakPage';
import ForceLegalPage from './pages/ForceLegalPage';
import ParameterLockPage from './pages/ParameterLockPage';
import LobsterTransition from './components/LobsterTransition';
import SharePreviewPage from './pages/SharePreviewPage';
import FinalEndingPage from './pages/FinalEndingPage';
import AnimationTestPage from './pages/AnimationTestPage';
import EndingDebugPage from './pages/EndingDebugPage';

function App() {
  return (
    <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
      <div className="w-[402px] h-[874px] bg-white overflow-y-auto scrollbar-hide shadow-2xl relative">
        <BrowserRouter>
          <StatBar />
          <Routes>
            <Route path="/" element={<StartPage />} />
            <Route path="/game" element={<GamePage />} />
            <Route path="/select" element={<ActivitySelectPage />} />
            <Route path="/feedback" element={<FeedbackPage />} />
            <Route path="/reflect" element={<ReflectPage />} />
            <Route path="/legal-break" element={<LegalBreakPage />} />
            <Route path="/force-legal" element={<ForceLegalPage />} />
            <Route path="/parameter-lock" element={<ParameterLockPage />} />
            <Route path="/transition" element={<LobsterTransition />} />
            <Route path="/result" element={<ResultPage />} />
            <Route path="/final-ending" element={<FinalEndingPage />} />
            <Route path="/share-preview" element={<SharePreviewPage />} />
            <Route path="/animation-test" element={<AnimationTestPage />} />
            <Route path="/ending-debug" element={<EndingDebugPage />} />
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  );
}

export default App;
