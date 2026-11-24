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
import { ingredientLibrary } from '../../data/recipe';
import {
  clearEditingRecipeId,
  readEditingRecipeId,
  writeEditingRecipeId,
} from '../../data/editingSession';
import { useStore } from '../../context/useStore';
import './Edit.css';

const ingredientById = new Map(
  ingredientLibrary.map((ingredient) => [ingredient.id, ingredient])
);

function ingredientLabel(item) {
  if (typeof item === 'string') return item;
  return item.name ?? ingredientById.get(item.id)?.name ?? item.id;
}

function ingredientKey(item) {
  return typeof item === 'string' ? item : item.id;
}

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

        const editingId = readEditingRecipeId();
        const editingRecipe = editingId
          ? savedRecipes.find((recipe) => String(recipe.id) === editingId)
          : null;

        if (editingRecipe) {
          setEditingRecipe(editingRecipe);
        } else if (editingId) {
          clearEditingRecipeId();
        }
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
      showToast(`"${recipe.title ?? recipe.name ?? 'Recipe'}" added`, {
        id: 'recipe-add',
        type: 'success',
      });

      return true;
    } catch (error) {
      console.error('Error adding recipe:', error);
      showToast('Could not add recipe', {
        id: 'recipe-add-error',
        type: 'error',
      });

      return false;
    }
  };

  // Delete recipe
  const handleDeleteRecipe = async (id) => {
    const deletedRecipe = recipes.find((recipe) => recipe.id === id);

    try {
      await deleteRecipeFromDB(id);
      setRecipes((prev) => prev.filter((recipe) => recipe.id !== id));

      if (editingRecipe && String(editingRecipe.id) === String(id)) {
        setEditingRecipe(null);
        clearEditingRecipeId();
      }

      showToast(
        deletedRecipe
          ? `"${deletedRecipe.title ?? deletedRecipe.name ?? 'Recipe'}" deleted`
          : 'Recipe deleted',
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
    writeEditingRecipeId(recipe.id);
  };

  const cancelEdit = () => {
    setEditingRecipe(null);
    clearEditingRecipeId();
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
      clearEditingRecipeId();
      showToast(
        `"${updatedRecipe.title ?? updatedRecipe.name ?? 'Recipe'}" updated`,
        {
          id: 'recipe-update',
          type: 'success',
        }
      );

      return true;
    } catch (error) {
      console.error('Error updating recipe:', error);
      showToast('Could not update recipe', {
        id: 'recipe-update-error',
        type: 'error',
      });

      return false;
    }
  };

  const seenIngredients = new Set();
  const ingredients = [];

  recipes.forEach((recipe) => {
    (recipe.ingredients ?? []).forEach((item) => {
      const id = ingredientKey(item);

      if (!id || seenIngredients.has(id)) return;

      seenIngredients.add(id);
      ingredients.push({ value: id, label: ingredientLabel(item) });
    });
  });

  const filteredRecipes = recipes.filter((recipe) => {
    const search = searchTerm.trim().toLowerCase();
    const title = recipe.title ?? recipe.name ?? '';

    const matchesTitle = title.toLowerCase().includes(search);

    const matchesIngredients = (recipe.ingredients ?? []).some((item) =>
      ingredientLabel(item).toLowerCase().includes(search)
    );

    const matchesCategory =
      selectedCategory === 'All' || recipe.category === selectedCategory;

    const matchesIngredient =
      selectedIngredient === 'All' ||
      (recipe.ingredients ?? []).some(
        (item) => ingredientKey(item) === selectedIngredient
      );

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
        onCancelEdit={cancelEdit}
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
