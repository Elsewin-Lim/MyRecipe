import { useState } from 'react';
import { ingredientLibrary } from '../../data/recipe';
import { INGREDIENT_OPTIONS, UNIT_OPTIONS } from '../../data/ingredientOptions';
import ComboBox from '../../components/ComboBox/ComboBox';
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

  const [selectedIngredient, setSelectedIngredient] = useState('');
  const [customIngredientName, setCustomIngredientName] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [unit, setUnit] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = [
    'All',
    ...new Set(ingredientLibrary.map((item) => item.category || 'Other')),
  ];

  const selectedLibraryItem = ingredientLibrary.find(
    (item) => item.id === selectedIngredient
  );

  const ingredientOptions =
    selectedIngredient && !selectedLibraryItem && customIngredientName
      ? [
          ...INGREDIENT_OPTIONS,
          { value: selectedIngredient, label: customIngredientName },
        ]
      : INGREDIENT_OPTIONS;

  const visibleItems = shoppingList.filter((item) => {
    const ingredient = ingredientLibrary.find((i) => i.id === item.id);

    const category = ingredient?.category || item.category || 'Other';

    return selectedCategory === 'All' || category === selectedCategory;
  });

  function handleIngredientChange(nextValue) {
    const ingredient = ingredientLibrary.find((item) => item.id === nextValue);

    setSelectedIngredient(nextValue);
    setCustomIngredientName('');
    setUnit(ingredient?.unit ?? '');
  }

  function handleCreateCustomIngredient(label) {
    setSelectedIngredient(`custom:${crypto.randomUUID()}`);
    setCustomIngredientName(label);
  }

  function handleAddIngredient(event) {
    event.preventDefault();

    const amount = Number(quantity);
    const name = selectedLibraryItem?.name ?? customIngredientName.trim();

    if (!name) {
      showToast('Choose or type an ingredient', {
        id: 'shopping-add-empty',
        type: 'warning',
      });
      return;
    }

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
        name: selectedLibraryItem ? undefined : name,
        unit: unit.trim(),
        quantity: amount,
      },
    ]);

    showToast(`${name} added to shopping list`, {
      id: 'shopping-add',
      type: 'success',
    });

    setSelectedIngredient('');
    setCustomIngredientName('');
    setQuantity('1');
    setUnit('');
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

        <div className="shoppingAddRow">
          <div className="shoppingAddField shoppingAddIngredient">
            <label htmlFor="shopping-ingredient">Ingredient</label>

            <ComboBox
              id="shopping-ingredient"
              options={ingredientOptions}
              value={selectedIngredient}
              onChange={handleIngredientChange}
              onCreateCustom={handleCreateCustomIngredient}
              allowCustom
              placeholder="Type to search or add a custom ingredient"
            />
          </div>

          <div className="shoppingAddField shoppingAddQuantity">
            <label htmlFor="shopping-quantity">Quantity</label>

            <input
              id="shopping-quantity"
              type="number"
              min="0"
              step="any"
              value={quantity}
              onFocus={(e) => e.target.select()}
              onChange={(event) => setQuantity(event.target.value)}
            />
          </div>

          <div className="shoppingAddField shoppingAddUnit">
            <label htmlFor="shopping-unit">Unit</label>

            <ComboBox
              id="shopping-unit"
              options={UNIT_OPTIONS}
              value={unit}
              onChange={setUnit}
              onQueryChange={setUnit}
              allowCustom
              placeholder="Unit"
            />
          </div>
        </div>

        <button type="submit">+ Add Ingredient</button>
      </form>

      <div className="shoppingListFilter">
        <label htmlFor="shopping-category">Filter list by category</label>

        <select
          id="shopping-category"
          value={selectedCategory}
          onChange={(event) => setSelectedCategory(event.target.value)}
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

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
