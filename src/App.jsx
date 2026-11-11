import './App.css';
import { useState } from 'react';
import RecipeList from './components/RecipeList';
import SearchBar from './components/SearchBar';
import CategoryFilter from './components/CategoryFilter';
import IngredientFilter from './components/IngredientFilter';
import RecipeForm from './components/RecipeForm';

function App() {
  const [recipes, setRecipes] = useState([
    {
      id: 1,
      title: 'Chicken Fried Rice',
      category: 'Dinner',
      cookingTime: 25,
      ingredients: ['Chicken', 'Rice', 'Egg', 'Garlic'],
    },
    {
      id: 2,
      title: 'Pancakes',
      category: 'Breakfast',
      cookingTime: 15,
      ingredients: ['Flour', 'Milk', 'Egg'],
    },
    {
      id: 3,
      title: 'Chocolate Cake',
      category: 'Dessert',
      cookingTime: 45,
      ingredients: ['Flour', 'Chocolate', 'Sugar'],
    },
  ]);

  // Store search input
  const [searchTerm, setSearchTerm] = useState('');

  // Store selected category
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Store selected ingredient
  const [selectedIngredient, setSelectedIngredient] = useState('All');

  // Store the recipe currently being edited
  const [editingRecipe, setEditingRecipe] = useState(null);

  // Add a new recipe
  const addRecipe = (newRecipe) => {
    setRecipes((prevRecipes) => [...prevRecipes, newRecipe]);
  };

  // Delete a recipe
  const deleteRecipe = (id) => {
    setRecipes((prevRecipes) =>
      prevRecipes.filter((recipe) => recipe.id !== id)
    );
  };

  // edit a recipe
  const editRecipe = (recipe) => {
    setEditingRecipe(recipe);
  };

  // Update an existing recipe
  const updateRecipe = (updatedRecipe) => {
    setRecipes((prevRecipes) =>
      prevRecipes.map((recipe) =>
        recipe.id === updatedRecipe.id ? updatedRecipe : recipe
      )
    );

    setEditingRecipe(null);
  };

  // Get unique ingredients from all recipes
  const ingredients = [
    ...new Set(recipes.flatMap((recipe) => recipe.ingredients || [])),
  ];

  // Search and filter recipes
  const filteredRecipes = recipes.filter((recipe) => {
    const search = searchTerm.toLowerCase();

    // Search by recipe title
    const matchesTitle = recipe.title.toLowerCase().includes(search);

    // Search by ingredients
    const matchesIngredients = (recipe.ingredients || []).some((ingredient) =>
      ingredient.toLowerCase().includes(search)
    );

    // Filter by category
    const matchesCategory =
      selectedCategory === 'All' || recipe.category === selectedCategory;

    // Filter by selected ingredient
    const matchesIngredient =
      selectedIngredient === 'All' ||
      (recipe.ingredients || []).includes(selectedIngredient);

    // Return recipes matching all selected filters
    return (
      (matchesTitle || matchesIngredients) &&
      matchesCategory &&
      matchesIngredient
    );
  });

  return (
    <>
      <h1>MyRecipes</h1>

      {/* display search bar */}
      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      {/* display filter */}
      <CategoryFilter
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      {/* display ingredient filter */}
      <IngredientFilter
        ingredients={ingredients}
        selectedIngredient={selectedIngredient}
        setSelectedIngredient={setSelectedIngredient}
      />

      {/* Display add recipe form */}
      <RecipeForm
        onAddRecipe={addRecipe}
        editingRecipe={editingRecipe}
        onUpdateRecipe={updateRecipe}
      />

      {/* display list sample food */}
      <RecipeList
        recipes={filteredRecipes}
        onDeleteRecipe={deleteRecipe}
        onEditRecipe={editRecipe}
      />
    </>
  );
}

export default App;
