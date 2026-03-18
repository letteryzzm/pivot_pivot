import { BrowserRouter, Routes, Route } from 'react-router-dom';
import StartPage from './pages/StartPage';
import GamePage from './pages/GamePage';
import ActivitySelectPage from './pages/ActivitySelectPage';
import ResultPage from './pages/ResultPage';
import FeedbackPage from './pages/FeedbackPage';
import ReflectPage from './pages/ReflectPage';
import TransitionPage from './pages/TransitionPage';
import LegalBreakPage from './pages/LegalBreakPage';
import ForceLegalPage from './pages/ForceLegalPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<StartPage />} />
        <Route path="/game" element={<GamePage />} />
        <Route path="/select" element={<ActivitySelectPage />} />
        <Route path="/feedback" element={<FeedbackPage />} />
        <Route path="/reflect" element={<ReflectPage />} />
        <Route path="/transition" element={<TransitionPage />} />
        <Route path="/legal-break" element={<LegalBreakPage />} />
        <Route path="/force-legal" element={<ForceLegalPage />} />
        <Route path="/result" element={<ResultPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
