import { useMemo } from 'react';
import Intro from '../../components/Intro/Intro';
import Book from '../../components/Book/Book';
import { DEFAULT_BOOK_PAGE_KEY } from '../../components/Book/bookPageStorage';
import RecipeEntry from '../../components/Book/Content/RecipeEntry';
import BookTestContent from '../../dev/book-test/BookTestContent';
import { BOOK_TEST_VERSION } from '../../dev/book-test/bookTestData';
import { ingredientLibrary, recipes } from '../../data/recipe';
import './MyRecipe.css';

const ingredientById = new Map(
  ingredientLibrary.map((ingredient) => [ingredient.id, ingredient])
);

const useTestBook =
  import.meta.env.DEV &&
  !new URLSearchParams(window.location.search).has('recipes');

function Home() {
  const contentKey = useMemo(
    () => (useTestBook ? BOOK_TEST_VERSION : JSON.stringify(recipes)),
    []
  );

  return (
    <div className="landingPage">
      <div className="bookArea">
        <Intro />
        <Book
          contentKey={contentKey}
          storageKey={
            useTestBook ? 'myrecipe:book-test-page' : DEFAULT_BOOK_PAGE_KEY
          }
        >
          {useTestBook ? (
            <BookTestContent />
          ) : (
            recipes.map((recipe, index) => (
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
  );
}

export default Home;
