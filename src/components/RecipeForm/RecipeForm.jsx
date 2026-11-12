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

  const handleSubmit = (e) => {
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

    if (isEditing) {
      onUpdateRecipe({ ...editingRecipe, ...recipe });
      return;
    }

    onAddRecipe({ id: Date.now(), ...recipe });

    setTitle('');
    setCategory('Breakfast');
    setCookingTime('');
    setIngredients('');
  };

  return (
    <form onSubmit={handleSubmit} className="add-recipe-form">
      <h2>{isEditing ? 'Edit Recipe' : 'Add New Recipe'}</h2>

      <input
        type="text"
        placeholder="Recipe title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="Breakfast">Breakfast</option>
        <option value="Lunch">Lunch</option>
        <option value="Dinner">Dinner</option>
        <option value="Dessert">Dessert</option>
      </select>

      <input
        type="number"
        placeholder="Cooking time (minutes)"
        value={cookingTime}
        onChange={(e) => setCookingTime(e.target.value)}
        min="1"
        required
      />

      <input
        type="text"
        placeholder="Ingredients (separate with commas)"
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
