import RecipeCard from '../RecipeCard/RecipeCard';

function RecipeList({ recipes, onDeleteRecipe, onEditRecipe }) {
  return (
    <div className="recipe-list">
      {recipes.map((recipe) => (
        <RecipeCard
          key={recipe.id}
          recipe={recipe}
          onDeleteRecipe={onDeleteRecipe}
          onEditRecipe={onEditRecipe}
        />
      ))}
    </div>
  );
}

export default RecipeList;
