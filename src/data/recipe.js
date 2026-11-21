import { Bakery } from './Ingredient/bakery.js';
import { Dairy } from './Ingredient/Dairy.js';
import { Egg } from './Ingredient/Egg.js';
import { Fruit } from './Ingredient/Fruits.js';
import { Grain } from './Ingredient/Grain.js';
import { Herbs } from './Ingredient/Herb.js';
import { Legumes } from './Ingredient/Legumes.js';
import { Meat } from './Ingredient/Meat.js';
import { Nut } from './Ingredient/Nut.js';
import { Pantry } from './Ingredient/Pantry.js';
import { Sauce } from './Ingredient/Sauce.js';
import { Seafood } from './Ingredient/Seafood.js';
import { Spice } from './Ingredient/Spice.js';
import { Vegetable } from './Ingredient/Vegetable.js';

export const ingredientLibrary = [
  ...Bakery,
  ...Dairy,
  ...Egg,
  ...Fruit,
  ...Grain,
  ...Herbs,
  ...Legumes,
  ...Meat,
  ...Nut,
  ...Pantry,
  ...Sauce,
  ...Seafood,
  ...Spice,
  ...Vegetable,
];

export const recipes = [
  {
    id: 'fried-rice',
    name: 'Fried Rice',
    ingredients: [
      { id: 'rice', quantity: 200 },
      { id: 'egg', quantity: 2 },
      { id: 'garlic', quantity: 3 },
      { id: 'oil', quantity: 20 },
    ],
    instructions: [
      'Cook the rice if needed, then let it cool slightly and break up any clumps.',
      'Mince the garlic and beat the eggs in a bowl.',
      'Heat half the oil in a skillet. Scramble the eggs until set, then transfer them to a plate.',
      'Heat the remaining oil in the same skillet. Stir in the garlic for about 30 seconds, then add the cooked rice and stir-fry until hot.',
      'Return the eggs to the skillet, toss everything together, and serve.',
    ],
  },
  {
    id: 'omelette',
    name: 'Omelette',
    ingredients: [
      { id: 'egg', quantity: 3 },
      { id: 'onion', quantity: 1 },
      { id: 'tomato', quantity: 1 },
    ],
    instructions: [
      'Finely dice the onion and tomato. Crack the eggs into a bowl and whisk until combined.',
      'Heat a nonstick pan over medium heat. Cook the onion and tomato until softened and most of the tomato liquid has evaporated.',
      'Pour in the eggs and reduce the heat. Cook until the eggs are fully set, then fold the omelette and serve.',
    ],
  },
  {
    id: 'margherita-pizza',
    name: 'Margherita Pizza',
    cuisine: 'Italian',
    cookingTime: 20,
    servings: 2,
    ingredients: [
      { id: 'pizza-dough', quantity: 250 },
      { id: 'tomato-paste', quantity: 60 },
      { id: 'mozzarella', quantity: 150 },
      { id: 'basil', quantity: 10 },
      { id: 'olive-oil', quantity: 15 },
      { id: 'salt', quantity: 3 },
    ],
    instructions: [
      'Preheat the oven to 230°C (450°F). Stretch the dough into a round and place it on a baking tray.',
      'Spread a thin layer of tomato paste over the dough, leaving a border. Sprinkle with salt and add the mozzarella.',
      'Drizzle with olive oil and bake for 10–15 minutes, until the crust is golden and the cheese is bubbling.',
      'Top with fresh basil, slice, and serve.',
    ],
  },
  {
    id: 'pepperoni-pizza',
    name: 'Pepperoni Pizza',
    cuisine: 'Italian-American',
    cookingTime: 20,
    servings: 2,
    ingredients: [
      { id: 'pizza-dough', quantity: 250 },
      { id: 'tomato-paste', quantity: 60 },
      { id: 'mozzarella', quantity: 150 },
      { id: 'pepperoni', quantity: 100 },
      { id: 'olive-oil', quantity: 15 },
    ],
    instructions: [
      'Preheat the oven to 230°C (450°F). Stretch the dough and place it on a baking tray.',
      'Spread the tomato paste over the dough, leaving a border. Add the mozzarella and arrange the pepperoni slices on top.',
      'Drizzle with olive oil and bake for 10–15 minutes, until the crust is golden and the cheese is bubbling.',
      'Let the pizza rest for 2 minutes before slicing.',
    ],
  },
  {
    id: 'hawaiian-pizza',
    name: 'Hawaiian Pizza',
    cuisine: 'International',
    cookingTime: 20,
    servings: 2,
    ingredients: [
      { id: 'pizza-dough', quantity: 250 },
      { id: 'tomato-paste', quantity: 60 },
      { id: 'mozzarella', quantity: 150 },
      { id: 'ham', quantity: 100 },
      { id: 'pineapple', quantity: 100 },
    ],
    instructions: [
      'Preheat the oven to 230°C (450°F). Stretch the dough and place it on a baking tray.',
      'Cut the ham and pineapple into bite-sized pieces. Drain and pat the pineapple dry.',
      'Spread the tomato paste over the dough, leaving a border. Add the mozzarella, ham, and pineapple.',
      'Bake for 10–15 minutes, until the crust is golden and the cheese is bubbling. Let it rest for 2 minutes before slicing.',
    ],
  },
  {
    id: 'garlic-omelette',
    name: 'Garlic Omelette',
    cookingTime: 10,
    servings: 1,
    ingredients: [
      { id: 'egg', quantity: 3 },
      { id: 'garlic', quantity: 2 },
      { id: 'oil', quantity: 10 },
    ],
    instructions: [
      'Crack the eggs into a bowl and whisk until combined.',
      'Finely chop the garlic. Heat the oil over medium heat and stir in the garlic for about 30 seconds.',
      'Pour in the eggs and cook until fully set. Fold the omelette and serve.',
    ],
  },
  {
    id: 'tomato-egg-rice',
    name: 'Tomato and Egg Rice',
    cookingTime: 20,
    servings: 2,
    ingredients: [
      { id: 'rice', quantity: 150 },
      { id: 'egg', quantity: 3 },
      { id: 'tomato', quantity: 2 },
      { id: 'garlic', quantity: 2 },
      { id: 'oil', quantity: 15 },
      { id: 'salt', quantity: 2 },
    ],
    instructions: [
      'Cook the rice according to the package directions.',
      'Chop the tomatoes, mince the garlic, and beat the eggs.',
      'Heat half the oil in a skillet. Scramble the eggs until set, then transfer them to a plate.',
      'Add the remaining oil and garlic to the skillet. Stir for 30 seconds, then add the tomatoes and salt. Cook until the tomatoes soften.',
      'Return the eggs to the skillet, stir gently, and serve over the rice.',
    ],
  },
  {
    id: 'garlic-mozzarella-flatbread',
    name: 'Garlic Mozzarella Flatbread',
    cookingTime: 20,
    servings: 2,
    ingredients: [
      { id: 'pizza-dough', quantity: 250 },
      { id: 'garlic', quantity: 3 },
      { id: 'olive-oil', quantity: 15 },
      { id: 'mozzarella', quantity: 120 },
      { id: 'basil', quantity: 5 },
      { id: 'salt', quantity: 2 },
    ],
    instructions: [
      'Preheat the oven to 230°C (450°F). Stretch the dough into a thin oval on a baking tray.',
      'Mince the garlic and mix it with the olive oil and salt. Brush the mixture over the dough.',
      'Scatter the mozzarella over the dough. Bake for 10–15 minutes, until the edges are golden and the cheese is bubbling.',
      'Top with torn basil leaves, slice, and serve.',
    ],
  },
  {
    id: 'grape-pineapple-salad',
    name: 'Grape and Pineapple Salad',
    cookingTime: 10,
    servings: 2,
    ingredients: [
      { id: 'grape', quantity: 150 },
      { id: 'pineapple', quantity: 200 },
      { id: 'yogurt', quantity: 100 },
    ],
    instructions: [
      'Wash the grapes and cut them in half.',
      'Cut the pineapple into bite-sized pieces and drain any excess juice.',
      'Fold the grapes and pineapple into the yogurt. Divide into two bowls and serve chilled.',
    ],
  },
];
