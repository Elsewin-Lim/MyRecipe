function FavoriteButton({
  isFavorite = false,
  onToggle,
  recipeTitle,
  className = '',
  ...rest
}) {
  const classes = [className, isFavorite ? 'is-favorite' : '']
    .filter(Boolean)
    .join(' ');

  return (
    <button
      {...rest}
      type="button"
      className={classes}
      aria-pressed={isFavorite}
      aria-label={
        recipeTitle
          ? isFavorite
            ? `Remove ${recipeTitle} from favorites`
            : `Add ${recipeTitle} to favorites`
          : undefined
      }
      onClick={onToggle}
    >
      {isFavorite ? '★ Favorited' : '☆ Favorite'}
    </button>
  );
}

export default FavoriteButton;
