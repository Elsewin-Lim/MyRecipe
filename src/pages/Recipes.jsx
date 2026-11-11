import { recipes, ingredientLibrary } from "../data/recipe";
import { useRecipe } from "../context/RecipeContext";
import "./Recipes.css";

export default function Recipes() {
    const { addIngredients } = useRecipe();

    return (
        <div>
            <h1>Recipe library</h1>
            <p>Explore recipes and add ingredients to your shopping list.</p>
            <div className="recipe-grid">

            {recipes.map((recipe) => (
                <div key={recipe.id} className="recipe-card">
                    <h2>{recipe.name}</h2>

                    <h3>Ingredients:</h3>

                    <ul className="recipe-ingredients">
                        {recipe.ingredients.map((item) => {
                            const ingredient = ingredientLibrary.find((i) => i.id === item.id);
                            
                            return (
                                <li key={item.id}>
                                    {ingredient?.name} - {item.quantity} {ingredient?.unit}
                                </li>
                            );
                        })}
                    </ul>
                    <button type="button" onClick={() => addIngredients(recipe.ingredients)}>Add to shopping List</button>
                </div>
            ))}
        </div>
      </div>
    );
}