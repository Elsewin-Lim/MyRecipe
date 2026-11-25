import { ingredientLibrary } from '../../data/recipe';
import AddToShoppingListButton from '../AddToShoppingListButton/AddToShoppingListButton';
import FavoriteButton from '../FavoriteButton/FavoriteButton';
import CookButton from '../CookButton/CookButton';
import RecipeImageCarousel from '../RecipeImageCarousel/RecipeImageCarousel';
import './RecipeLibraryCard.css';

function RecipeLibraryCard({ recipe, onAddIngredients, onToggleFavorite }) {
  const title = recipe.title ?? recipe.name ?? 'Untitled recipe';
  const ingredients = recipe.ingredients ?? [];
  const isFavorite = Boolean(recipe.favorite);
  const hasInstructions = (recipe.instructions ?? []).length > 0;
  const images = (recipe.images ?? []).filter(Boolean);

  return (
    <article className="recipeLibraryCard">
      <h2>{title}</h2>

      {images.length > 0 && (
        <RecipeImageCarousel images={images} title={title} variant="card" />
      )}

      <h3>Ingredients:</h3>

      <ul className="recipeIngredients">
        {ingredients.length === 0 && <li>No ingredients listed.</li>}

        {ingredients.map((item, index) => {
          if (typeof item === 'string') {
            return <li key={`${item}-${index}`}>{item}</li>;
          }

          const ingredient = ingredientLibrary.find((i) => i.id === item.id);
          const name = item.name ?? ingredient?.name ?? item.id;
          const unit = item.unit ?? ingredient?.unit ?? '';

          return (
            <li key={`${item.id}-${index}`}>
              {name} - {item.quantity}
              {unit ? ` ${unit}` : ''}
            </li>
          );
        })}
      </ul>

      <div className="recipeLibraryCardActions">
        {onToggleFavorite && (
          <FavoriteButton
            className="favoriteButton"
            isFavorite={isFavorite}
            recipeTitle={title}
            onToggle={() => onToggleFavorite(recipe)}
          />
        )}

        {hasInstructions && (
          <CookButton className="recipeCookButton" recipeId={recipe.id}>
            Cook
          </CookButton>
        )}

        {onAddIngredients && (
          <AddToShoppingListButton onClick={() => onAddIngredients(recipe)}>
            Add to shopping list
          </AddToShoppingListButton>
        )}
      </div>
    </article>
  );
}

export default RecipeLibraryCard;
