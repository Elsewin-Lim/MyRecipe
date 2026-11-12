import { useState } from 'react';
import { ingredientLibrary } from '../../data/recipe';
import { useRecipe } from '../../context/recipeContext';
import './ShoppingList.css';

function ShoppingList() {
  const {
    shoppingList,
    addIngredients,
    toggleBought,
    removeIngredient,
    updateQuantity,
    clearBought,
    clearAll,
  } = useRecipe();

  const [selectedIngredient, setSelectedIngredient] = useState('rice');
  const [quantity, setQuantity] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = [
    'All',
    ...new Set(ingredientLibrary.map((item) => item.category || 'Other')),
  ];

  const filteredIngredients = ingredientLibrary.filter(
    (ingredient) =>
      selectedCategory === 'All' ||
      (ingredient.category || 'Other') === selectedCategory
  );

  const visibleItems = shoppingList.filter((item) => {
    const ingredient = ingredientLibrary.find((i) => i.id === item.id);

    const category = ingredient?.category || item.category || 'Other';

    return selectedCategory === 'All' || category === selectedCategory;
  });

  function handleAddIngredient(event) {
    event.preventDefault();

    const amount = Number(quantity);

    if (!Number.isFinite(amount) || amount <= 0) {
      return;
    }

    addIngredients([
      {
        id: selectedIngredient,
        quantity: amount,
      },
    ]);

    setQuantity(1);
  }

  return (
    <div className="shoppingListPage">
      <h1>My Shopping List</h1>
      <p>Here are the ingredients you need to buy.</p>

      <form onSubmit={handleAddIngredient}>
        <h2>Add Ingredient</h2>

        <label htmlFor="category">Filter by Category</label>

        <select
          id="category"
          value={selectedCategory}
          onChange={(event) => {
            const category = event.target.value;

            setSelectedCategory(category);

            const firstIngredient = ingredientLibrary.find(
              (item) =>
                category === 'All' || (item.category || 'Other') === category
            );

            setSelectedIngredient(firstIngredient?.id || '');
          }}
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>

        <label htmlFor="ingredient">Choose Ingredient:</label>

        <select
          id="ingredient"
          value={selectedIngredient}
          onChange={(event) => setSelectedIngredient(event.target.value)}
        >
          {filteredIngredients.map((ingredient) => (
            <option key={ingredient.id} value={ingredient.id}>
              {ingredient.name}
            </option>
          ))}
        </select>

        <label htmlFor="quantity">Quantity</label>

        <input
          id="quantity"
          type="number"
          min="1"
          step="1"
          value={quantity}
          onChange={(event) => setQuantity(event.target.value)}
          required
        />

        <button type="submit">+ Add Ingredient</button>
      </form>

      {shoppingList.length === 0 ? (
        <p>Your shopping list is empty.</p>
      ) : (
        <>
          {visibleItems.length === 0 && <p>No ingredients in this category.</p>}

          <ul>
            {visibleItems.map((item) => (
              <li key={item.id}>
                <label>
                  <input
                    type="checkbox"
                    checked={item.bought}
                    onChange={() => toggleBought(item.id)}
                  />

                  <span
                    style={{
                      textDecoration: item.bought ? 'line-through' : 'none',
                    }}
                  >
                    {item.name} - {item.quantity} {item.unit}
                    <small>
                      {' ('}
                      {ingredientLibrary.find(
                        (ingredient) => ingredient.id === item.id
                      )?.category ||
                        item.category ||
                        'Other'}
                      {')'}
                    </small>
                  </span>
                </label>

                <input
                  type="number"
                  min="1"
                  step="1"
                  value={item.quantity}
                  onChange={(event) =>
                    updateQuantity(item.id, event.target.value)
                  }
                />
                <span>{item.unit}</span>

                <button type="button" onClick={() => removeIngredient(item.id)}>
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </>
      )}

      <button
        type="button"
        onClick={clearBought}
        disabled={!shoppingList.some((item) => item.bought)}
      >
        Clear Purchased
      </button>
      <button
        type="button"
        onClick={clearAll}
        disabled={shoppingList.length === 0}
      >
        Clear All
      </button>
    </div>
  );
}

export default ShoppingList;
