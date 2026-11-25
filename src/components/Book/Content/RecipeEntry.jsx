import AddToShoppingListButton from '../../AddToShoppingListButton/AddToShoppingListButton';
import CookButton from '../../CookButton/CookButton';
import FavoriteButton from '../../FavoriteButton/FavoriteButton';
import RecipeImageCarousel from '../../RecipeImageCarousel/RecipeImageCarousel';
import {
  formatSeconds,
  instructionText,
  totalInstructionSeconds,
} from '../../../data/recipeModel';

export default function RecipeEntry({ recipe, index, ingredientById }) {
  const title = recipe.title ?? recipe.name ?? 'Untitled recipe';
  const category = recipe.category ?? recipe.cuisine ?? '';
  const totalSeconds = totalInstructionSeconds(recipe.instructions);
  const totalTime =
    totalSeconds > 0
      ? formatSeconds(totalSeconds)
      : recipe.cookingTime > 0
        ? `${recipe.cookingTime} min`
        : '';
  const isFavorite = Boolean(recipe.favorite);
  const instructions = (recipe.instructions ?? [])
    .map((step) => instructionText(step))
    .filter(Boolean);
  const images = (recipe.images ?? []).filter(Boolean);
  const ingredients = (recipe.ingredients ?? []).map((item, itemIndex) => {
    if (typeof item === 'string') {
      return {
        key: `${item}-${itemIndex}`,
        name: item,
        quantity: '',
        unit: '',
      };
    }

    const ingredient = ingredientById.get(item.id);

    return {
      key: `${item.id}-${itemIndex}`,
      name: item.name ?? ingredient?.name ?? item.id,
      quantity: item.quantity ?? '',
      unit: item.unit ?? ingredient?.unit ?? '',
    };
  });

  return (
    <article className={`recipe-entry${index === 0 ? ' first' : ''}`}>
      <div className="recipe-entry-header">
        <CookButton
          className="recipe-entry-action recipe-entry-action--cook"
          recipeId={recipe.id}
          data-recipe-action="cook"
          data-recipe-id={recipe.id}
        />
        <AddToShoppingListButton
          className="recipe-entry-action recipe-entry-action--shopping"
          data-recipe-action="shopping"
          data-recipe-id={recipe.id}
          aria-label="Add ingredients to shopping list"
        />
        <button
          type="button"
          className="recipe-entry-action recipe-entry-action--edit"
          data-recipe-action="edit"
          data-recipe-id={recipe.id}
        >
          Edit
        </button>
        <button
          type="button"
          className="recipe-entry-action recipe-entry-action-danger"
          data-recipe-action="delete"
          data-recipe-id={recipe.id}
        >
          Delete
        </button>
      </div>

      <div className="recipe-entry-title-row">
        <FavoriteButton
          className="recipe-favorite-star"
          isFavorite={isFavorite}
          recipeTitle={title}
          data-favorite-id={recipe.id}
          data-favorite-star
        >
          {isFavorite ? '★' : '☆'}
        </FavoriteButton>
        <h1>{title}</h1>
        {category && (
          <span className="recipe-entry-badge recipe-entry-badge--category">
            {category}
          </span>
        )}
        {totalTime && (
          <span className="recipe-entry-badge recipe-entry-badge--time">
            {totalTime}
          </span>
        )}
      </div>

      {images.length > 0 && (
        <RecipeImageCarousel images={images} title={title} variant="book" />
      )}

      <h2>Ingredients</h2>

      {ingredients.length > 0 ? (
        <table className="recipe-ingredients-table">
          <thead>
            <tr>
              <th scope="col">Ingredient</th>
              <th scope="col">Qty</th>
              <th scope="col">Unit</th>
            </tr>
          </thead>
          <tbody>
            {ingredients.map((ingredient) => (
              <tr key={ingredient.key}>
                <td>{ingredient.name}</td>
                <td>{ingredient.quantity}</td>
                <td>{ingredient.unit}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="recipe-empty">No ingredients listed.</p>
      )}

      {instructions.length > 0 && (
        <>
          <h2>Instructions</h2>
          <ol className="recipe-instructions">
            {instructions.map((step, stepIndex) => (
              <li key={`${stepIndex}-${step.slice(0, 16)}`}>{step}</li>
            ))}
          </ol>
        </>
      )}
    </article>
  );
}
