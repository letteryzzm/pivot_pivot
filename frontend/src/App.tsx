import { BrowserRouter, Routes, Route } from 'react-router-dom';
import StartPage from './pages/StartPage';
import GamePage from './pages/GamePage';
import ActivitySelectPage from './pages/ActivitySelectPage';
import ResultPage from './pages/ResultPage';
import FeedbackPage from './pages/FeedbackPage';
import ReflectPage from './pages/ReflectPage';
import LegalBreakPage from './pages/LegalBreakPage';
import ForceLegalPage from './pages/ForceLegalPage';
import ParameterLockPage from './pages/ParameterLockPage';
import ChildhoodTransitionPage from './pages/ChildhoodTransitionPage';
import TeenTransitionPage from './pages/TeenTransitionPage';
import AdultTransitionPage from './pages/AdultTransitionPage';
import SharePreviewPage from './pages/SharePreviewPage';

function App() {
  return (
    <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
      <div className="w-[402px] h-[874px] bg-white overflow-y-auto scrollbar-hide shadow-2xl">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<StartPage />} />
            <Route path="/game" element={<GamePage />} />
            <Route path="/select" element={<ActivitySelectPage />} />
            <Route path="/feedback" element={<FeedbackPage />} />
            <Route path="/reflect" element={<ReflectPage />} />
            <Route path="/legal-break" element={<LegalBreakPage />} />
            <Route path="/force-legal" element={<ForceLegalPage />} />
            <Route path="/parameter-lock" element={<ParameterLockPage />} />
            <Route path="/childhood-transition" element={<ChildhoodTransitionPage />} />
            <Route path="/teen-transition" element={<TeenTransitionPage />} />
            <Route path="/adult-transition" element={<AdultTransitionPage />} />
            <Route path="/result" element={<ResultPage />} />
            <Route path="/share-preview" element={<SharePreviewPage />} />
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  );
}

export default App;
