import { useEffect, useState } from 'react';
import { ingredientLibrary } from '../data/recipe';
import { RecipeContext } from './recipeContext';

export function RecipeProvider({ children }) {
  const [shoppingList, setShoppingList] = useState(() => {
    try {
      const savedList = localStorage.getItem('shoppingList');
      const parsed = savedList ? JSON.parse(savedList) : [];

      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('shoppingList', JSON.stringify(shoppingList));
  }, [shoppingList]);

  function addIngredients(ingredients) {
    setShoppingList((previousList) => {
      const updatedList = [...previousList];

      ingredients.forEach((item) => {
        const ingredient = ingredientLibrary.find((i) => i.id === item.id);
        const quantity = Number(item.quantity);

        if (!ingredient || !Number.isFinite(quantity) || quantity <= 0) {
          return;
        }

        const existingIndex = updatedList.findIndex((i) => i.id === item.id);

        if (existingIndex !== -1) {
          updatedList[existingIndex] = {
            ...updatedList[existingIndex],
            quantity: updatedList[existingIndex].quantity + quantity,
            bought: false,
          };
        } else {
          updatedList.push({
            ...ingredient,
            quantity,
            bought: false,
          });
        }
      });

      return updatedList;
    });
  }

  function toggleBought(id) {
    setShoppingList((previousList) =>
      previousList.map((item) =>
        item.id === id ? { ...item, bought: !item.bought } : item
      )
    );
  }

  function removeIngredient(id) {
    setShoppingList((previousList) =>
      previousList.filter((item) => item.id !== id)
    );
  }

  function updateQuantity(id, newQuantity) {
    const quantity = Number(newQuantity);

    if (!Number.isFinite(quantity) || quantity <= 0) {
      return;
    }

    setShoppingList((previousList) =>
      previousList.map((item) =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  }

  function clearBought() {
    setShoppingList((previousList) =>
      previousList.filter((item) => !item.bought)
    );
  }

  function clearAll() {
    setShoppingList([]);
  }

  return (
    <RecipeContext.Provider
      value={{
        shoppingList,
        addIngredients,
        toggleBought,
        removeIngredient,
        updateQuantity,
        clearBought,
        clearAll,
      }}
    >
      {children}
    </RecipeContext.Provider>
  );
}
