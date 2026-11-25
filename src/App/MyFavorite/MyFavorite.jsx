import { useEffect, useState } from 'react';
import { useStore } from '../../context/useStore';
import { getAllRecipes, setRecipeFavorite } from '../../data/recipeDatabase';
import RecipeLibraryCard from '../../components/RecipeLibraryCard/RecipeLibraryCard';
import { useAddToShoppingList } from '../../hooks/useAddToShoppingList';
import './MyFavorite.css';

function MyFavorite() {
  const { showToast } = useStore();
  const addRecipeToShoppingList = useAddToShoppingList();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    getAllRecipes()
      .then((storedRecipes) => {
        if (active) setRecipes(storedRecipes);
      })
      .catch((error) => {
        console.error('Error loading recipes:', error);
        if (active) {
          showToast('Could not load recipes', {
            id: 'favorites-load-error',
            type: 'error',
          });
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [showToast]);

  const favoriteRecipes = recipes.filter((recipe) => recipe.favorite);

  const handleToggleFavorite = async (recipe) => {
    const nextFavorite = !recipe.favorite;
    const title = recipe.title ?? recipe.name ?? 'Recipe';

    setRecipes((previous) =>
      previous.map((item) =>
        String(item.id) === String(recipe.id)
          ? { ...item, favorite: nextFavorite }
          : item
      )
    );
    showToast(
      nextFavorite
        ? `"${title}" added to favorites`
        : `"${title}" removed from favorites`,
      { id: 'recipe-favorite', type: 'success' }
    );

    try {
      await setRecipeFavorite(recipe.id, nextFavorite);
    } catch (error) {
      console.error('Error updating favorite:', error);
      setRecipes((previous) =>
        previous.map((item) =>
          String(item.id) === String(recipe.id)
            ? { ...item, favorite: !nextFavorite }
            : item
        )
      );
      showToast('Could not update favorite', {
        id: 'recipe-favorite-error',
        type: 'error',
      });
    }
  };

  return (
    <div className="myFavoritePage">
      <h1>My Favorite Recipes</h1>
      <p>Recipes you marked as favorite from the MyRecipe book.</p>

      {loading ? (
        <p className="myFavoriteEmpty">Loading recipes…</p>
      ) : favoriteRecipes.length === 0 ? (
        <p className="myFavoriteEmpty">
          No favorite recipes yet. Open MyRecipe and tap Favorite on a recipe.
        </p>
      ) : (
        <div className="favoriteRecipeGrid">
          {favoriteRecipes.map((recipe) => (
            <RecipeLibraryCard
              key={recipe.id}
              recipe={recipe}
              onToggleFavorite={handleToggleFavorite}
              onAddIngredients={addRecipeToShoppingList}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default MyFavorite;
