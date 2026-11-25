import { toShoppingIngredients } from '../data/shoppingList';
import { useRecipe } from '../context/recipeContext';
import { useStore } from '../context/useStore';

export function useAddToShoppingList() {
  const { addIngredients } = useRecipe();
  const { showToast } = useStore();

  return (recipe) => {
    const ingredients = toShoppingIngredients(recipe.ingredients ?? []);
    const title = recipe.title ?? recipe.name ?? 'Recipe';

    if (ingredients.length === 0) {
      showToast(`No shopping-list ingredients found in "${title}"`, {
        id: 'recipe-add-shopping-empty',
        type: 'warning',
      });
      return false;
    }

    addIngredients(ingredients);
    showToast(`"${title}" ingredients added to shopping list`, {
      id: 'recipe-add-shopping',
      type: 'success',
    });
    return true;
  };
}
