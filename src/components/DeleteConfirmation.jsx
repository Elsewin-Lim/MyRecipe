const DeleteConfirmation = ({ recipe, onDeleteRecipe }) => {
  return (
    <button
      onClick={() => {
        const confirmDelete = window.confirm(
          `Are you sure you want to delete "${recipe.title}"?`
        );

        if (confirmDelete) {
          onDeleteRecipe(recipe.id);
        }
      }}
    >
      Delete
    </button>
  );
};

export default DeleteConfirmation;
