import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';
import LobsterTransition from '../components/LobsterTransition';

export default function AdultTransitionPage() {
  const navigate = useNavigate();
  const { lobster } = useGameStore();

  const fromAge = 17;
  const toAge = 18;

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
