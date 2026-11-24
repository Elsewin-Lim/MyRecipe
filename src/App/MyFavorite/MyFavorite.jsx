import { recipes } from '../../data/recipe';
import { useRecipe } from '../../context/recipeContext';
import { useStore } from '../../context/useStore';
import RecipeLibraryCard from '../../components/RecipeLibraryCard/RecipeLibraryCard';
import './MyFavorite.css';

function Recipes() {
  const { addIngredients } = useRecipe();
  const { showToast } = useStore();

  const handleAddIngredients = (recipe) => {
    const count = recipe.ingredients?.length ?? 0;

    addIngredients(recipe.ingredients);
    showToast(
      `Added ${count} ingredient${count === 1 ? '' : 's'} from ${recipe.name} to your shopping list.`,
      { type: 'success' }
    );
  };

  return (
    <div className="recipesPage">
      <h1>Recipe library</h1>
      <p>Explore recipes and add ingredients to your shopping list.</p>

      <div className="recipeLibraryGrid">
        {recipes.map((recipe) => (
          <RecipeLibraryCard
            key={recipe.id}
            recipe={recipe}
            onAddIngredients={() => handleAddIngredients(recipe)}
          />
        ))}
      </div>
    </div>
  );
}

export default Recipes;
