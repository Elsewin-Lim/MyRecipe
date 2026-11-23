import { IndexDB } from '../../DB/IndexDB';

const DB_NAME = 'MyRecipeDatabase';
const DB_VERSION = 1;
const STORE_NAME = 'recipes';

let recipeDbPromise;

function getRecipeDb() {
  if (!recipeDbPromise) {
    recipeDbPromise = IndexDB.create(DB_NAME, DB_VERSION, STORE_NAME);
  }
  return recipeDbPromise;
}

/**
 * Adds a new recipe or updates an existing one.
 * @param {Record<string, any>} recipe
 * @returns {Promise<IDBValidKey>}
 */
export const saveRecipe = async (recipe) => {
  const db = await getRecipeDb();
  return db.save(recipe);
};

/**
 * Retrieves all recipes from the store.
 * @returns {Promise<Array<any>>}
 */
export const getAllRecipes = async () => {
  const db = await getRecipeDb();
  return db.getAll();
};

/**
 * Retrieves a single recipe by ID.
 * @param {IDBValidKey} id
 * @returns {Promise<any>}
 */
export const getRecipe = async (id) => {
  const db = await getRecipeDb();
  return db.get(id);
};

/**
 * Deletes a recipe by ID.
 * @param {IDBValidKey} id
 * @returns {Promise<boolean>}
 */
export const deleteRecipe = async (id) => {
  const db = await getRecipeDb();
  return db.del(id);
};
