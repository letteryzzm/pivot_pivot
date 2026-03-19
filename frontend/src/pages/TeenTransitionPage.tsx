import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';
import LobsterTransition from '../components/LobsterTransition';

export default function TeenTransitionPage() {
  const navigate = useNavigate();
  const { lobster } = useGameStore();

  const fromAge = 12;
  const toAge = 13;

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
