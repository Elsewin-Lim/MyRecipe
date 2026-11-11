import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";
import { RecipePorvider } from "./context/RecipeContext";
import { BrowserRouter } from "react-router"
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RecipePorvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </RecipePorvider>
  </React.StrictMode>
);