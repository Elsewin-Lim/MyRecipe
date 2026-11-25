function AddToShoppingListButton({
  className = '',
  children = 'Add to shopping list',
  ...rest
}) {
  return (
    <button {...rest} type="button" className={className}>
      {children}
    </button>
  );
}

export default AddToShoppingListButton;
