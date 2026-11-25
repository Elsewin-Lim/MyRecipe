import { useStartCooking } from '../../hooks/useStartCooking';

function CookButton({ recipeId, className = '', children = 'Cook', ...rest }) {
  const startCooking = useStartCooking();

  function handleClick() {
    startCooking(recipeId);
  }

  return (
    <button type="button" className={className} {...rest} onClick={handleClick}>
      {children}
    </button>
  );
}

export default CookButton;
