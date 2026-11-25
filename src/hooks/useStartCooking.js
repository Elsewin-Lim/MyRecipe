import { useNavigate } from 'react-router';
import { startCookingSession } from '../data/cookingSession';
import { useTimer } from '../context/timerContext';

export function useStartCooking() {
  const navigate = useNavigate();
  const { clearTimer } = useTimer();

  return (recipeId) => {
    if (recipeId == null) return false;

    clearTimer();
    startCookingSession(recipeId);
    navigate('/TODO');
    return true;
  };
}
