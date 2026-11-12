import { ingredientLibrary } from '../../data/recipe';
import './RecipeLibraryCard.css';

function RecipeLibraryCard({ recipe, onAddIngredients }) {
  return (
    <article className="recipeLibraryCard">
      <h2>{recipe.name}</h2>

      <h3>Ingredients:</h3>

      <ul className="recipeIngredients">
        {recipe.ingredients.map((item) => {
          const ingredient = ingredientLibrary.find((i) => i.id === item.id);

          return (
            <li key={item.id}>
              {ingredient?.name} - {item.quantity} {ingredient?.unit}
            </li>
          );
        })}
      </ul>

      <button
        type="button"
        onClick={() => onAddIngredients(recipe.ingredients)}
      >
        Add to shopping List
      </button>
    </article>
  );
}

export default RecipeLibraryCard;
