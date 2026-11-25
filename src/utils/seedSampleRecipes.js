import { recipes } from '../data/recipe';
import { getAllRecipes, saveRecipe } from '../data/recipeDatabase';

const SEED_FLAG_KEY = 'myrecipe:sample-recipes-seeded';
const SEED_VERSION = '2';

function hasSeeded() {
  try {
    return window.localStorage.getItem(SEED_FLAG_KEY) === SEED_VERSION;
  } catch {
    return false;
  }
}

function markSeeded() {
  try {
    window.localStorage.setItem(SEED_FLAG_KEY, SEED_VERSION);
  } catch {
    return;
  }
}

export async function seedSampleRecipes() {
  if (hasSeeded()) return 0;

  try {
    const existing = await getAllRecipes();
    const existingIds = new Set(existing.map((recipe) => String(recipe.id)));
    const missing = recipes.filter(
      (recipe) => !existingIds.has(String(recipe.id))
    );

    for (const recipe of missing) {
      await saveRecipe(recipe);
    }

    markSeeded();
    return missing.length;
  } catch (error) {
    console.error('Could not seed sample recipes:', error);
    return 0;
  }
}
