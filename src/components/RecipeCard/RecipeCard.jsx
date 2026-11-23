import ConfirmDialog from '../Dialog/ConfirmDialog';
import { useState } from 'react';
function RecipeCard({ recipe, onDeleteRecipe, onEditRecipe }) {
  const [Dialog, setDialog] = useState(false);
  const handleDelete = () => {
    onDeleteRecipe(recipe.id);
    setDialog(false);
  };

  return (
    <div className="recipe-card">
      <h2>{recipe.title}</h2>
      <p>Category: {recipe.category}</p>
      <p>Cooking Time: {recipe.cookingTime}</p>

      <div className="recipe-card-actions">
        <button type="button" onClick={() => onEditRecipe(recipe)}>
          Edit
        </button>

        <button
          type="button"
          className="recipe-card-delete"
          onClick={() => setDialog(true)}
        >
          Delete
        </button>
        <ConfirmDialog
          open={Dialog}
          title="Delete Recipe?"
          message={`Are you sure you want to delete "${recipe.title}"?`}
          confirmLabel="Delete"
          cancelLabel="Keep Recipe"
          danger
          onConfirm={handleDelete}
          onCancel={() => setDialog(false)}
        />
      </div>
    </div>
  );
}

export default RecipeCard;
