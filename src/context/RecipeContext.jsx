import { createContext, useContext, useEffect, useState } from "react";
import { ingredientLibrary } from "../data/recipe";

// Create the Context
const RecipeContext = createContext (null);

export function RecipePorvider ({children}) {

    //1. Store the shopping list
        const [shoppingList, setShoppingList] = useState (() => {
            try {
                const saveList = localStorage.getItem("shoppingList");
                const parsed = saveList ? JSON.parse(saveList) : [];

                return Array.isArray(parsed) ? parsed : [];
            }   catch {
                    return [];
            }
        });

    //2. save shopping list to localStorage
        useEffect(() => {
         localStorage.setItem("shoppingList", JSON.stringify(shoppingList));
        }, [shoppingList]);

    //3.Add ingredients to shopping list
        function addIngredients (ingredients) {
            setShoppingList ((previousList) => {
                const updatedList = [...previousList];

                ingredients.forEach ((item) => {
                    const ingredient = ingredientLibrary.find ((i) => i.id === item.id);
                    const quantity = Number(item.quantity);

                    if (
                        !ingredient ||
                        !Number.isFinite (quantity) ||
                        quantity <= 0)
                        {return;}
                        const existingIndex = updatedList.findIndex ((i) => i.id === item.id);

                        if (existingIndex !== -1) {
                            updatedList [existingIndex] = {
                                ...updatedList[existingIndex],
                                 quantity:updatedList [existingIndex].quantity + quantity,
                                 bought: false
                            };
                        } else {
                            updatedList.push ({
                                ...ingredient,
                                quantity: quantity,
                                bought: false
                            });
                        }
                    });
            
                return updatedList;
            });
        }
    //4. Mark an ingredient as bought
        function toggleBought (id) {
            setShoppingList((previousList) =>
            previousList.map((item)=>
                item.id ===id
                    ? {...item, bought: !item.bought}
                    : item
                )
            );
        }

    //5. Remove one Ingredient
        function removeIngredient(id) {
            setShoppingList((previousList) =>
                previousList.filter((item) => item.id !== id)
            );
        }

        function updateQuantity(id, newQuantity) {
            const quantity = Number(newQuantity);

            if (!Number.isFinite(quantity) || quantity <= 0) {
                return;
            }

            setShoppingList((previousList) =>
                previousList.map((item) =>
                    item.id === id
                        ? { ...item, quantity: quantity}
                        : item
            )
          );
        }
    //6. Clear purchased ingredients
        function clearBought() {
            setShoppingList((previousList) =>
                previousList.filter((item) => !item.bought)
            );
        }
    //7. Clear the entire shopping list
        function clearAll() {
            setShoppingList([]);
        }
        return(
            <RecipeContext.Provider
                value={{
                    shoppingList,
                    addIngredients,
                    toggleBought,
                    removeIngredient,
                    updateQuantity,
                    clearBought,
                    clearAll
                }}
            >
                {children}
            </RecipeContext.Provider>
        );
}

// Custom hook for accessing Context
export function useRecipe() {
    const context = useContext(RecipeContext);

    if (!context) {
        throw new Error(
            "useRecipe must be used inside RecipeProvider"
        );
    }

    return context
}