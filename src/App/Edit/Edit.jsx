import { useState, useEffect } from 'react';
import RecipeList from '../../components/RecipeList/RecipeList';
import SearchBar from '../../components/SearchBar/SearchBar';
import CategoryFilter from '../../components/CategoryFilter/CategoryFilter';
import IngredientFilter from '../../components/IngredientFilter/IngredientFilter';
import RecipeForm from '../../components/RecipeForm/RecipeForm';
import {
  getAllRecipes,
  saveRecipe,
  deleteRecipe as deleteRecipeFromDB,
} from '../../data/recipeDatabase';
import { useStore } from '../../context/useStore';
import './Edit.css';

function Edit() {
  const [recipes, setRecipes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedIngredient, setSelectedIngredient] = useState('All');
  const [editingRecipe, setEditingRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useStore();

  // Load recipes from IndexedDB
  useEffect(() => {
    const loadRecipes = async () => {
      try {
        const savedRecipes = await getAllRecipes();
        setRecipes(savedRecipes);
      } catch (error) {
        console.error('Error loading recipes:', error);
      } finally {
        setLoading(false);
      }
    };

    loadRecipes();
  }, []);

  // Add recipe
  const addRecipe = async (newRecipe) => {
    try {
      const recipe = {
        ...newRecipe,
        id: newRecipe.id ?? crypto.randomUUID(),
      };

      await saveRecipe(recipe);
      setRecipes((prev) => [...prev, recipe]);
      showToast(`"${recipe.title}" added`, {
        id: 'recipe-add',
        type: 'success',
      });
    } catch (error) {
      console.error('Error adding recipe:', error);
      showToast('Could not add recipe', {
        id: 'recipe-add-error',
        type: 'error',
      });
    }
  };

  // Delete recipe
  const handleDeleteRecipe = async (id) => {
    const deletedRecipe = recipes.find((recipe) => recipe.id === id);

    try {
      await deleteRecipeFromDB(id);
      setRecipes((prev) => prev.filter((recipe) => recipe.id !== id));
      showToast(
        deletedRecipe ? `"${deletedRecipe.title}" deleted` : 'Recipe deleted',
        { id: 'recipe-delete', type: 'success' }
      );
    } catch (error) {
      console.error('Error deleting recipe:', error);
      showToast('Could not delete recipe', {
        id: 'recipe-delete-error',
        type: 'error',
      });
    }
  };

  // Select recipe for editing
  const editRecipe = (recipe) => {
    setEditingRecipe(recipe);
  };

  // Update recipe
  const updateRecipe = async (updatedRecipe) => {
    try {
      await saveRecipe(updatedRecipe);

      setRecipes((prev) =>
        prev.map((recipe) =>
          recipe.id === updatedRecipe.id ? updatedRecipe : recipe
        )
      );

      setEditingRecipe(null);
      showToast(`"${updatedRecipe.title}" updated`, {
        id: 'recipe-update',
        type: 'success',
      });
    } catch (error) {
      console.error('Error updating recipe:', error);
      showToast('Could not update recipe', {
        id: 'recipe-update-error',
        type: 'error',
      });
    }
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

  if (loading) {
    return (
      <div className="editPage">
        <p className="editEmpty">Loading recipes...</p>
      </div>
    );
  }

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

      {filteredRecipes.length === 0 ? (
        <p className="editEmpty">No recipes match your filters yet.</p>
      ) : (
        <RecipeList
          recipes={filteredRecipes}
          onDeleteRecipe={handleDeleteRecipe}
          onEditRecipe={editRecipe}
        />
      )}
    </div>
  );
}

export default Edit;
