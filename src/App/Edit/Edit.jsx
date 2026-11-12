import { useState } from 'react';
import RecipeList from '../../components/RecipeList/RecipeList';
import SearchBar from '../../components/SearchBar/SearchBar';
import CategoryFilter from '../../components/CategoryFilter/CategoryFilter';
import IngredientFilter from '../../components/IngredientFilter/IngredientFilter';
import RecipeForm from '../../components/RecipeForm/RecipeForm';
import './Edit.css';

function Edit() {
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

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedIngredient, setSelectedIngredient] = useState('All');
  const [editingRecipe, setEditingRecipe] = useState(null);

  const addRecipe = (newRecipe) => {
    setRecipes((prevRecipes) => [...prevRecipes, newRecipe]);
  };

  const deleteRecipe = (id) => {
    setRecipes((prevRecipes) =>
      prevRecipes.filter((recipe) => recipe.id !== id)
    );
  };

  const editRecipe = (recipe) => {
    setEditingRecipe(recipe);
  };

  const updateRecipe = (updatedRecipe) => {
    setRecipes((prevRecipes) =>
      prevRecipes.map((recipe) =>
        recipe.id === updatedRecipe.id ? updatedRecipe : recipe
      )
    );

    setEditingRecipe(null);
  };

  const ingredients = [
    ...new Set(recipes.flatMap((recipe) => recipe.ingredients || [])),
  ];

  const filteredRecipes = recipes.filter((recipe) => {
    const search = searchTerm.toLowerCase();

    const matchesTitle = recipe.title.toLowerCase().includes(search);

    const matchesIngredients = (recipe.ingredients || []).some((ingredient) =>
      ingredient.toLowerCase().includes(search)
    );

    const matchesCategory =
      selectedCategory === 'All' || recipe.category === selectedCategory;

    const matchesIngredient =
      selectedIngredient === 'All' ||
      (recipe.ingredients || []).includes(selectedIngredient);

    return (
      (matchesTitle || matchesIngredients) &&
      matchesCategory &&
      matchesIngredient
    );
  });

  return (
    <div className="editPage">
      <h1>MyRecipes</h1>

      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      <CategoryFilter
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      <IngredientFilter
        ingredients={ingredients}
        selectedIngredient={selectedIngredient}
        setSelectedIngredient={setSelectedIngredient}
      />

      <RecipeForm
        key={editingRecipe ? editingRecipe.id : 'new'}
        onAddRecipe={addRecipe}
        editingRecipe={editingRecipe}
        onUpdateRecipe={updateRecipe}
        onCancelEdit={() => setEditingRecipe(null)}
      />

      <RecipeList
        recipes={filteredRecipes}
        onDeleteRecipe={deleteRecipe}
        onEditRecipe={editRecipe}
      />
    </div>
  );
}

export default Edit;
