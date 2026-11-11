function IngredientFilter({
  ingredients,
  selectedIngredient,
  setSelectedIngredient,
}) {
  return (
    <div className="ingredient-filter">
      <label htmlFor="ingredient">Filter by ingredient: </label>

      <select
        id="ingredient"
        value={selectedIngredient}
        onChange={(e) => setSelectedIngredient(e.target.value)}
      >
        <option value="All">All Ingredients</option>

        {ingredients.map((ingredient) => (
          <option key={ingredient} value={ingredient}>
            {ingredient}
          </option>
        ))}
      </select>
    </div>
  );
}

export default IngredientFilter;
