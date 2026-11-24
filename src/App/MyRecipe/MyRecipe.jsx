import { useEffect, useMemo, useState } from 'react';
import Intro from '../../components/Intro/Intro';
import Book from '../../components/Book/Book';
import { DEFAULT_BOOK_PAGE_KEY } from '../../components/Book/bookPageStorage';
import RecipeEntry from '../../components/Book/Content/RecipeEntry';
import SearchBar from '../../components/SearchBar/SearchBar';
import { ingredientLibrary } from '../../data/recipe';
import { getAllRecipes, setRecipeFavorite } from '../../data/recipeDatabase';
import { useStore } from '../../context/useStore';
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
    const button =
      event.target instanceof Element
        ? event.target.closest('[data-favorite-id]')
        : null;
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
    </div>
  );
}

export default Home;
