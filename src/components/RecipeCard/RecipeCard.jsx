import { useState } from 'react';
import ConfirmDialog from '../Dialog/ConfirmDialog';
import { useStore } from '../../context/useStore';

function RecipeCard({ recipe, onDeleteRecipe, onEditRecipe }) {
  const { showToast } = useStore();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleConfirmDelete = () => {
    setConfirmOpen(false);
    onDeleteRecipe(recipe.id);
    showToast(`Recipe "${recipe.title}" deleted.`, { type: 'success' });
  };

  return (
    <>
      <div className="recipe-card">
        <h2>{recipe.title}</h2>
        <p>Category: {recipe.category}</p>
        <p>Cooking Time: {recipe.cookingTime}</p>

        <button type="button" onClick={() => onEditRecipe(recipe)}>
          Edit
        </button>

        <button type="button" onClick={() => setConfirmOpen(true)}>
          Delete
        </button>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title="Delete recipe"
        message={`Delete "${recipe.title}"? This cannot be undone.`}
        confirmLabel="Delete"
        danger
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </>
  );
}

export default RecipeCard;
