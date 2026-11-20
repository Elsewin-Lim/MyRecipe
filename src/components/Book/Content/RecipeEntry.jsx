export default function RecipeEntry({ recipe, index, ingredientById }) {
  const meta = [
    recipe.cuisine,
    recipe.cookingTime != null ? `${recipe.cookingTime} min` : null,
    recipe.servings != null ? `${recipe.servings} servings` : null,
  ].filter(Boolean);

  return (
    <article
      className={`recipe-entry${index === 0 ? ' recipe-entry--first' : ''}`}
    >
      <h1>{recipe.name}</h1>
      {meta.length > 0 && <p className="recipe-meta">{meta.join(' · ')}</p>}

      <h2>Ingredients</h2>
      <ul className="recipe-ingredients">
        {recipe.ingredients.map((item, itemIndex) => {
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
    </article>
  );
}
