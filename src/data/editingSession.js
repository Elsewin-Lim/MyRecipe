const EDITING_RECIPE_KEY = 'myrecipe:editing-recipe-id';

export function readEditingRecipeId() {
  try {
    return window.localStorage.getItem(EDITING_RECIPE_KEY);
  } catch {
    return null;
  }
}

export function writeEditingRecipeId(id) {
  try {
    window.localStorage.setItem(EDITING_RECIPE_KEY, String(id));
  } catch {
    return;
  }
}

export function clearEditingRecipeId() {
  try {
    window.localStorage.removeItem(EDITING_RECIPE_KEY);
  } catch {
    return;
  }
}
