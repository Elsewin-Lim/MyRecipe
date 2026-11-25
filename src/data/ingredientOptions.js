import { ingredientLibrary } from './recipe';

export const INGREDIENT_OPTIONS = ingredientLibrary.map((ingredient) => ({
  value: ingredient.id,
  label: ingredient.name,
}));

export const UNIT_OPTIONS = [
  ...new Set([
    ...ingredientLibrary.map((ingredient) => ingredient.unit).filter(Boolean),
    'kg',
    'l',
    'tbsp',
    'tsp',
    'cup',
  ]),
]
  .sort((a, b) => a.localeCompare(b))
  .map((unit) => ({ value: unit, label: unit }));
