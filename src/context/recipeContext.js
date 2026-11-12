import { createContext, useContext } from 'react';

export const RecipeContext = createContext(null);

export function useRecipe() {
  const context = useContext(RecipeContext);

  if (!context) {
    throw new Error('useRecipe must be used inside RecipeProvider');
  }

  return context;
}
