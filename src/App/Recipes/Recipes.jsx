import { recipes } from '../../data/recipe';
import { useRecipe } from '../../context/recipeContext';
import { useStore } from '../../context/useStore';
import RecipeLibraryCard from '../../components/RecipeLibraryCard/RecipeLibraryCard';
import './Recipes.css';

function Recipes() {
  const { addIngredients } = useRecipe();
  const { showToast } = useStore();

  const handleAddIngredients = (recipe) => {
    addIngredients(recipe.ingredients);
    showToast(`${recipe.name} added to shopping list`, {
      id: 'recipe-add-ingredients',
      type: 'success',
    });
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
            onAddIngredients={handleAddIngredients}
          />
        ))}
      </div>
    </div>
  );
}

export default Recipes;
