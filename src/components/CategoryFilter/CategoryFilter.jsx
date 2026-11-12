function CategoryFilter({ selectedCategory, setSelectedCategory }) {
  return (
    <div className="category-filter">
      <label htmlFor="category">Filter by category: </label>

      <select
        id="category"
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
      >
        <option value="All">All Categories</option>
        <option value="Breakfast">Breakfast</option>
        <option value="Lunch">Lunch</option>
        <option value="Dinner">Dinner</option>
        <option value="Dessert">Dessert</option>
      </select>
    </div>
  );
}

export default CategoryFilter;
