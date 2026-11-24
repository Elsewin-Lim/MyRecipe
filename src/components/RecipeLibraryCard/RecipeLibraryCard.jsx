import { Link } from 'react-router';
import { ingredientLibrary } from '../../data/recipe';
import FavoriteButton from '../FavoriteButton/FavoriteButton';
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
        <div className="recipeLibraryImages">
          {images.map((src, imageIndex) => (
            <img
              key={`${imageIndex}-${src.slice(0, 24)}`}
              className="recipeLibraryImage"
              src={src}
              alt={`${title} — ${imageIndex + 1}`}
              loading="lazy"
            />
          ))}
        </div>
      )}

      <h3>Ingredients:</h3>

      <ul className="recipeIngredients">
        {ingredients.length === 0 && <li>No ingredients listed.</li>}

        {ingredients.map((item, index) => {
          if (typeof item === 'string') {
            return <li key={`${item}-${index}`}>{item}</li>;
          }

          const ingredient = ingredientLibrary.find((i) => i.id === item.id);

          return (
            <li key={`${item.id}-${index}`}>
              {ingredient?.name ?? item.id} - {item.quantity} {ingredient?.unit}
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
          <Link
            className="recipeInstructionButton"
            to={`/TODO?recipe=${encodeURIComponent(recipe.id)}`}
          >
            Instruction
          </Link>
        )}

        {onAddIngredients && (
          <button type="button" onClick={() => onAddIngredients(recipe)}>
            Add to shopping List
          </button>
        )}
      </div>
    </article>
  );
}

export default RecipeLibraryCard;
