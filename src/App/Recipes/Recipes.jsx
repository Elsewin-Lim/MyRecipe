import { recipes } from '../../data/recipe';
import { useRecipe } from '../../context/recipeContext';
import RecipeLibraryCard from '../../components/RecipeLibraryCard/RecipeLibraryCard';
import './Recipes.css';

function Recipes() {
  const { addIngredients } = useRecipe();

  return (
    <div className="recipesPage">
      <h1>Recipe library</h1>
      <p>Explore recipes and add ingredients to your shopping list.</p>

      <div className="recipeLibraryGrid">
        {recipes.map((recipe) => (
          <RecipeLibraryCard
            key={recipe.id}
            recipe={recipe}
            onAddIngredients={addIngredients}
          />
        ))}
      </div>
    </div>
  );
}

export default Recipes;
