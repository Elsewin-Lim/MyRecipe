import { useState } from 'react'
import ShoppingList from './pages/ShoppingList'
import Recipes from './pages/Recipes'
import { Routes, Route, NavLink } from 'react-router'
import './App.css'


function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <nav>
        <NavLink to="/recipes">Recipes</NavLink>
        {" | "}
        <NavLink to="/shopping-list">Shopping List</NavLink>
      </nav>

      <Routes>
        <Route path="/" element={<Recipes />} />
        <Route path="/recipes" element={<Recipes />} />
        <Route path="/shopping-list" element={<ShoppingList />} />
      </Routes>
    </div>
  );
}

export default App;
