import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import Intro from '../../components/Intro/Intro';
import Book from '../../components/Book/Book';
import { DEFAULT_BOOK_PAGE_KEY } from '../../components/Book/bookPageStorage';
import RecipeEntry from '../../components/Book/Content/RecipeEntry';
import ConfirmDialog from '../../components/Dialog/ConfirmDialog';
import SearchBar from '../../components/SearchBar/SearchBar';
import { ingredientLibrary } from '../../data/recipe';
import {
  deleteRecipe as deleteRecipeFromDB,
  getAllRecipes,
  setRecipeFavorite,
} from '../../data/recipeDatabase';
import { startCookingSession } from '../../data/cookingSession';
import { writeEditingRecipeId } from '../../data/editingSession';
import { useStore } from '../../context/useStore';
import { useTimer } from '../../context/timerContext';
import './MyRecipe.css';

const ingredientById = new Map(
  ingredientLibrary.map((ingredient) => [ingredient.id, ingredient])
);

function matchesSearch(recipe, term) {
  if (!term) return true;

  const haystack = [
    recipe.title,
    recipe.name,
    recipe.category,
    recipe.cuisine,
    ...(recipe.ingredients ?? []).map((item) =>
      typeof item === 'string' ? item : item.id
    ),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  return haystack.includes(term);
}

function applyFavoriteState(button, isFavorite) {
  button.classList.toggle('is-favorite', isFavorite);
  button.setAttribute('aria-pressed', String(isFavorite));
  button.textContent = isFavorite ? '★ Favorited' : '☆ Favorite';
}

function Home() {
  const [recipes, setRecipes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [pendingDelete, setPendingDelete] = useState(null);
  const navigate = useNavigate();
  const { clearTimer } = useTimer();
  const { showToast } = useStore();

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
            id: 'recipes-load-error',
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

  const normalizedSearch = searchTerm.trim().toLowerCase();

  const filteredRecipes = useMemo(
    () => recipes.filter((recipe) => matchesSearch(recipe, normalizedSearch)),
    [recipes, normalizedSearch]
  );

  const showStatus = loading || filteredRecipes.length === 0;
  const statusMessage = loading
    ? 'Loading recipes…'
    : recipes.length === 0
      ? 'No recipes yet. Add one from the Edit page.'
      : 'No recipes match your search.';

  const bookContentKey = useMemo(
    () =>
      showStatus
        ? `status:${statusMessage}`
        : JSON.stringify(
            filteredRecipes.map((recipe) => [
              recipe.id,
              recipe.title ?? recipe.name,
              recipe.category ?? recipe.cuisine ?? null,
              recipe.cookingTime ?? null,
              recipe.ingredients ?? [],
              recipe.instructions ?? [],
              (recipe.images ?? []).map((src) =>
                typeof src === 'string'
                  ? `${src.slice(0, 32)}:${src.length}`
                  : ''
              ),
            ])
          ),
    [showStatus, statusMessage, filteredRecipes]
  );

  const handleBookClick = async (event) => {
    const target = event.target instanceof Element ? event.target : null;
    if (!target) return;

    const actionButton = target.closest('[data-recipe-action]');

    if (actionButton) {
      const action = actionButton.getAttribute('data-recipe-action');
      const id = actionButton.getAttribute('data-recipe-id');
      const recipe = recipes.find((item) => String(item.id) === id);

      if (action === 'cook' && id) {
        clearTimer();
        startCookingSession(id);
        navigate('/TODO');
        return;
      }

      if (action === 'edit' && id) {
        writeEditingRecipeId(id);
        navigate('/Edit');
        return;
      }

      if (action === 'delete' && recipe) {
        setPendingDelete(recipe);
        return;
      }
    }

    const button = target.closest('[data-favorite-id]');
    if (!button) return;

    const id = button.getAttribute('data-favorite-id');
    const recipe = recipes.find((item) => String(item.id) === id);
    if (!recipe) return;

    const nextFavorite = !recipe.favorite;
    const title = recipe.title ?? recipe.name ?? 'Recipe';

    setRecipes((previous) =>
      previous.map((item) =>
        String(item.id) === id ? { ...item, favorite: nextFavorite } : item
      )
    );
    applyFavoriteState(button, nextFavorite);
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
          String(item.id) === id ? { ...item, favorite: !nextFavorite } : item
        )
      );
      applyFavoriteState(button, !nextFavorite);
      showToast('Could not update favorite', {
        id: 'recipe-favorite-error',
        type: 'error',
      });
    }
  };

  async function handleConfirmDelete() {
    if (!pendingDelete) return;

    const id = pendingDelete.id;
    const title = pendingDelete.title ?? pendingDelete.name ?? 'Recipe';

    try {
      await deleteRecipeFromDB(id);
      setRecipes((previous) =>
        previous.filter((item) => String(item.id) !== String(id))
      );
      setPendingDelete(null);
      showToast(`"${title}" deleted`, {
        id: 'recipe-delete',
        type: 'success',
      });
    } catch (error) {
      console.error('Error deleting recipe:', error);
      showToast('Could not delete recipe', {
        id: 'recipe-delete-error',
        type: 'error',
      });
    }
  }

  return (
    <div className="landingPage">
      <div className="bookArea">
        <Intro />
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <div onClick={handleBookClick}>
          <Book contentKey={bookContentKey} storageKey={DEFAULT_BOOK_PAGE_KEY}>
            {showStatus ? (
              <article className="recipe-entry first">
                <p className="recipe-book-status">{statusMessage}</p>
              </article>
            ) : (
              filteredRecipes.map((recipe, index) => (
                <RecipeEntry
                  key={recipe.id}
                  recipe={recipe}
                  index={index}
                  ingredientById={ingredientById}
                />
              ))
            )}
          </Book>
        </div>
      </div>

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete Recipe?"
        message={`Are you sure you want to delete "${pendingDelete?.title ?? pendingDelete?.name ?? 'this recipe'}"?`}
        confirmLabel="Delete"
        cancelLabel="Keep Recipe"
        danger
        onConfirm={handleConfirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}

export default Home;
