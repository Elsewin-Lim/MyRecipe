import { useState } from 'react';
import { ingredientLibrary } from '../../data/recipe';
import { useRecipe } from '../../context/recipeContext';
import { useStore } from '../../context/useStore';
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
  const { showToast } = useStore();

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
      showToast('Enter a quantity greater than zero', {
        id: 'shopping-add-invalid',
        type: 'warning',
      });
      return;
    }

    addIngredients([
      {
        id: selectedIngredient,
        quantity: amount,
      },
    ]);

    const ingredient = ingredientLibrary.find(
      (item) => item.id === selectedIngredient
    );

    showToast(`${ingredient?.name ?? 'Ingredient'} added to shopping list`, {
      id: 'shopping-add',
      type: 'success',
    });

    setQuantity(1);
  }

  function handleRemoveIngredient(item) {
    removeIngredient(item.id);
    showToast(`${item.name} removed from shopping list`, {
      id: 'shopping-remove',
      type: 'success',
    });
  }

  function handleClearBought() {
    const boughtCount = shoppingList.filter((item) => item.bought).length;
    clearBought();
    showToast(
      `${boughtCount} purchased ${boughtCount === 1 ? 'item' : 'items'} cleared`,
      { id: 'shopping-clear-bought', type: 'success' }
    );
  }

  function handleClearAll() {
    clearAll();
    showToast('Shopping list cleared', {
      id: 'shopping-clear-all',
      type: 'success',
    });
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
        <p className="shoppingListEmpty">Your shopping list is empty.</p>
      ) : (
        <>
          {visibleItems.length === 0 && (
            <p className="shoppingListEmpty">
              No ingredients in this category.
            </p>
          )}

          <ul>
            {visibleItems.map((item) => (
              <li key={item.id}>
                <label className="shoppingItemLabel">
                  <input
                    type="checkbox"
                    checked={item.bought}
                    onChange={() => toggleBought(item.id)}
                  />

                  <span
                    className="shoppingItemName"
                    style={{
                      textDecoration: item.bought ? 'line-through' : 'none',
                    }}
                  >
                    {item.name}
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

                <div className="shoppingItemControls">
                  <input
                    type="number"
                    min="1"
                    step="1"
                    aria-label={`Quantity for ${item.name}`}
                    value={item.quantity}
                    onChange={(event) =>
                      updateQuantity(item.id, event.target.value)
                    }
                  />
                  <span className="shoppingItemUnit">{item.unit}</span>

                  <button
                    type="button"
                    className="shoppingItemRemove"
                    onClick={() => handleRemoveIngredient(item)}
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}

      <div className="shoppingListActions">
        <button
          type="button"
          className="shoppingListButton"
          onClick={handleClearBought}
          disabled={!shoppingList.some((item) => item.bought)}
        >
          Clear Purchased
        </button>
        <button
          type="button"
          className="shoppingListButton danger"
          onClick={handleClearAll}
          disabled={shoppingList.length === 0}
        >
          Clear All
        </button>
      </div>
    </div>
  );
}

export default ShoppingList;
