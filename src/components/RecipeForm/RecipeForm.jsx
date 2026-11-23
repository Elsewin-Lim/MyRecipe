import { useState } from 'react';

function RecipeForm({
  onAddRecipe,
  editingRecipe,
  onUpdateRecipe,
  onCancelEdit,
}) {
  const isEditing = Boolean(editingRecipe);

  const [title, setTitle] = useState(editingRecipe?.title ?? '');
  const [category, setCategory] = useState(
    editingRecipe?.category ?? 'Breakfast'
  );
  const [cookingTime, setCookingTime] = useState(
    editingRecipe ? String(editingRecipe.cookingTime) : ''
  );
  const [ingredients, setIngredients] = useState(
    editingRecipe ? editingRecipe.ingredients.join(', ') : ''
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !cookingTime || !ingredients.trim()) {
      return;
    }

    const ingredientList = ingredients
      .split(',')
      .map((item) => item.trim())
      .filter((item) => item !== '');

    const recipe = {
      title: title.trim(),
      category,
      cookingTime: Number(cookingTime),
      ingredients: ingredientList,
    };

    try {
      if (isEditing) {
        await onUpdateRecipe({
          ...editingRecipe,
          ...recipe,
        });
      } else {
        await onAddRecipe({
          id: crypto.randomUUID(),
          ...recipe,
        });
      }

      setTitle('');
      setCategory('Breakfast');
      setCookingTime('');
      setIngredients('');
    } catch (error) {
      console.error('Error saving recipe:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="add-recipe-form">
      <h2>{isEditing ? 'Edit Recipe' : 'Add New Recipe'}</h2>

      <label htmlFor="recipe-title">Recipe title</label>

      <input
        id="recipe-title"
        type="text"
        placeholder="e.g. Chicken Curry"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <label htmlFor="recipe-category">Category</label>

      <select
        id="recipe-category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        <option value="Breakfast">Breakfast</option>
        <option value="Lunch">Lunch</option>
        <option value="Dinner">Dinner</option>
        <option value="Dessert">Dessert</option>
      </select>

      <label htmlFor="recipe-time">Cooking time (minutes)</label>

      <input
        id="recipe-time"
        type="number"
        placeholder="e.g. 30"
        value={cookingTime}
        onChange={(e) => setCookingTime(e.target.value)}
        min="1"
        required
      />

      <label htmlFor="recipe-ingredients">
        Ingredients (separate with commas)
      </label>

      <input
        id="recipe-ingredients"
        type="text"
        placeholder="e.g. rice, egg, garlic"
        value={ingredients}
        onChange={(e) => setIngredients(e.target.value)}
        required
      />

      <button type="submit">
        {isEditing ? 'Update Recipe' : 'Add Recipe'}
      </button>

      {isEditing && (
        <button type="button" className="cancel-button" onClick={onCancelEdit}>
          Cancel
        </button>
      )}
    </form>
  );
}

export default RecipeForm;
