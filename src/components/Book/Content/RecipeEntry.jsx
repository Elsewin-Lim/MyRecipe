import FavoriteButton from '../../FavoriteButton/FavoriteButton';

export default function RecipeEntry({ recipe, index, ingredientById }) {
  const title = recipe.title ?? recipe.name ?? 'Untitled recipe';
  const meta = [
    recipe.category ?? recipe.cuisine,
    recipe.cookingTime != null ? `${recipe.cookingTime} min` : null,
    recipe.servings != null ? `${recipe.servings} servings` : null,
  ].filter(Boolean);
  const isFavorite = Boolean(recipe.favorite);
  const instructions = (recipe.instructions ?? []).filter(Boolean);
  const images = (recipe.images ?? []).filter(Boolean);

  return (
    <article className={`recipe-entry${index === 0 ? ' first' : ''}`}>
      <div className="recipe-entry-header">
        <h1>{title}</h1>
        <FavoriteButton
          className="recipe-favorite"
          isFavorite={isFavorite}
          recipeTitle={title}
          data-favorite-id={recipe.id}
        />
      </div>
      {meta.length > 0 && <p className="recipe-meta">{meta.join(' · ')}</p>}

      {images.length > 0 && (
        <div className="recipe-images">
          {images.map((src, imageIndex) => (
            <img
              key={`${imageIndex}-${src.slice(0, 24)}`}
              className="recipe-image"
              src={src}
              alt={`${title} — ${imageIndex + 1}`}
              loading="lazy"
            />
          ))}
        </div>
      )}

      <h2>Ingredients</h2>
      <ul className="recipe-ingredients">
        {(recipe.ingredients ?? []).map((item, itemIndex) => {
          if (typeof item === 'string') {
            return <li key={`${item}-${itemIndex}`}>{item}</li>;
          }

          const ingredient = ingredientById.get(item.id);

          return (
            <li key={`${item.id}-${itemIndex}`}>
              {ingredient
                ? `${ingredient.name} — ${item.quantity} ${ingredient.unit}`
                : `${item.id} — ${item.quantity}`}
            </li>
          );
        })}
      </ul>

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
