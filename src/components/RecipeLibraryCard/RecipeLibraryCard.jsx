import { ingredientLibrary } from '../../data/recipe';
import './RecipeLibraryCard.css';
import { Link } from 'react-router';

function RecipeLibraryCard({ recipe, onAddIngredients }) {
  return (
    <article className="recipeLibraryCard">
      <h2>{recipe.name}</h2>

      <h3>Ingredients:</h3>

      <ul className="recipeIngredients">
        {recipe.ingredients.map((item, index) => {
          const ingredient = ingredientLibrary.find((i) => i.id === item.id);

          return (
            <li key={`${item.id}-${index}`}>
              {ingredient?.name} - {item.quantity} {ingredient?.unit}
            </li>
          );
        })}
      </ul>

      <div className="recipeLibraryCardActions">
        <Link
          className="recipeInstructionButton"
          to={`/TODO?recipe=${encodeURIComponent(recipe.id)}`}
        >
          Instruction
        </Link>

        <button type="button" onClick={() => onAddIngredients(recipe)}>
          Add to shopping List
        </button>
      </div>
    </article>
  );
}

export default RecipeLibraryCard;
