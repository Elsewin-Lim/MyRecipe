import { useNavigate } from 'react-router';
import { startCookingSession } from '../../data/cookingSession';
import { useTimer } from '../../context/timerContext';

function CookButton({ recipeId, className, children, ...rest }) {
  const navigate = useNavigate();
  const { clearTimer } = useTimer();

  function handleClick() {
    if (recipeId == null) return;

    clearTimer();
    startCookingSession(recipeId);
    navigate('/TODO');
  }

  return (
    <button type="button" className={className} {...rest} onClick={handleClick}>
      {children}
    </button>
  );
}

export default CookButton;
