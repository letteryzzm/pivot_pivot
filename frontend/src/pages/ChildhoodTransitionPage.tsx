import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';
import LobsterTransition from '../components/LobsterTransition';

export default function ChildhoodTransitionPage() {
  const navigate = useNavigate();
  const { lobster } = useGameStore();

  const fromAge = 5;
  const toAge = 6;

  const handleComplete = () => {
    navigate('/select');
  };

  return (
    <LobsterTransition
      fromAge={fromAge}
      toAge={toAge}
      onComplete={handleComplete}
    />
  );
}
