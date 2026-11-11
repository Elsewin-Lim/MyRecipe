import { useState } from 'react';

function RecipeForm({ onAddRecipe }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Breakfast');
  const [cookingTime, setCookingTime] = useState('');
  const [ingredients, setIngredients] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title.trim() || !cookingTime || !ingredients.trim()) {
      return;
    }

    const ingredientList = ingredients
      .split(',')
      .map((item) => item.trim())
      .filter((item) => item !== '');

    const newRecipe = {
      id: Date.now(),
      title: title.trim(),
      category,
      cookingTime: Number(cookingTime),
      ingredients: ingredientList,
    };

    onAddRecipe(newRecipe);

    setTitle('');
    setCategory('Breakfast');
    setCookingTime('');
    setIngredients('');
  };

  return (
    <form onSubmit={handleSubmit} className="add-recipe-form">
      <h2>Add New Recipe</h2>

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

      <button type="submit">Add Recipe</button>
    </form>
  );
}

export default RecipeForm;
