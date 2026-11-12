function RecipeCard({ recipe, onDeleteRecipe, onEditRecipe }) {
  const handleDelete = () => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${recipe.title}"?`
    );

    if (confirmDelete) {
      onDeleteRecipe(recipe.id);
    }
  };

  return (
    <div className="recipe-card">
      <h2>{recipe.title}</h2>
      <p>Category: {recipe.category}</p>
      <p>Cooking Time: {recipe.cookingTime}</p>

      <button onClick={() => onEditRecipe(recipe)}>Edit</button>

      <button onClick={handleDelete}>Delete</button>
    </div>
  );
}

export default RecipeCard;
