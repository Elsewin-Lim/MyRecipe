import { useState } from 'react';
import { ingredientLibrary } from '../../data/recipe';
import { useRecipe } from '../../context/recipeContext';
import { useStore } from '../../context/useStore';
import FlipNotepad from '../../components/FlipNotepad/FlipNotepad';
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
      showToast('Enter a quantity greater than 0.', { type: 'error' });
      return;
    }

    const ingredient = ingredientLibrary.find(
      (item) => item.id === selectedIngredient
    );
    const amountLabel = ingredient?.unit
      ? `${amount} ${ingredient.unit}`
      : String(amount);
    const ingredientName = ingredient?.name ?? 'Ingredient';

    addIngredients([
      {
        id: selectedIngredient,
        quantity: amount,
      },
    ]);

    showToast(
      `Added ${ingredientName} (${amountLabel}) to your shopping list.`,
      { type: 'success' }
    );

    setQuantity(1);
  }

  function handleRemoveIngredient(item) {
    removeIngredient(item.id);
    showToast(`Removed ${item.name} from your shopping list.`, {
      type: 'info',
    });
  }

  function handleQuantityCommit(item, quantity) {
    showToast(`Updated ${item.name} to ${quantity} ${item.unit}.`, {
      type: 'info',
    });
  }

  function handleToggleBought(item) {
    toggleBought(item.id);
    showToast(
      item.bought
        ? `Marked ${item.name} as not bought.`
        : `Marked ${item.name} as bought.`,
      { type: 'info' }
    );
  }

  function handleClearBought() {
    const count = shoppingList.filter((item) => item.bought).length;

    clearBought();

    if (count > 0) {
      showToast(`Cleared ${count} purchased item${count === 1 ? '' : 's'}.`, {
        type: 'success',
      });
    }
  }

  function handleClearAll() {
    const count = shoppingList.length;

    clearAll();

    if (count > 0) {
      showToast(
        `Cleared ${count} item${count === 1 ? '' : 's'} from your shopping list.`,
        { type: 'success' }
      );
    }
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
                    onChange={() => handleToggleBought(item)}
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
                  onFocus={(event) => {
                    event.currentTarget.dataset.previousValue =
                      event.currentTarget.value;
                  }}
                  onBlur={(event) => {
                    const value = Number(event.currentTarget.value);

                    if (
                      event.currentTarget.value !==
                        event.currentTarget.dataset.previousValue &&
                      Number.isFinite(value) &&
                      value > 0
                    ) {
                      handleQuantityCommit(item, value);
                    }
                  }}
                />
                <span>{item.unit}</span>

                <button
                  type="button"
                  onClick={() => handleRemoveIngredient(item)}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </>
      )}

      <button
        type="button"
        onClick={handleClearBought}
        disabled={!shoppingList.some((item) => item.bought)}
      >
        Clear Purchased
      </button>
      <button
        type="button"
        onClick={handleClearAll}
        disabled={shoppingList.length === 0}
      >
        Clear All
      </button>

      <section className="shoppingListPage__notes">
        <h2>Daily notes</h2>
        <FlipNotepad className="shoppingListPage__notepad" />
      </section>
    </div>
  );
}

export default ShoppingList;
