import { ingredientLibrary } from './recipe';

export function toShoppingIngredients(ingredients = []) {
  return ingredients.flatMap((item) => {
    if (typeof item !== 'string') {
      return [
        {
          id: item.id,
          name: item.name,
          unit: item.unit,
          quantity: Number(item.quantity) || 1,
        },
      ];
    }

    const key = item.trim().toLowerCase();
    const match = ingredientLibrary.find(
      (ingredient) =>
        ingredient.id.toLowerCase() === key ||
        ingredient.name.toLowerCase() === key
    );

    return match ? [{ id: match.id, quantity: 1 }] : [];
  });
}
