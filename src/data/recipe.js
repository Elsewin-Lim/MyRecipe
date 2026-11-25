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
    id: 'spaghetti-bolognese',
    title: 'Spaghetti Bolognese',
    category: 'Dinner',
    cuisine: 'Italian',
    cookingTime: 52,
    servings: 4,
    images: [
      'https://www.themealdb.com/images/media/meals/sutysw1468247559.jpg',
    ],
    ingredients: [
      { id: 'onion', quantity: 2 },
      { id: 'olive-oil', quantity: 15 },
      { id: 'garlic', quantity: 2 },
      { id: 'ground-beef', quantity: 500 },
      { id: 'mushroom', quantity: 90 },
      {
        id: 'custom:dried-oregano',
        name: 'Dried Oregano',
        quantity: 3,
        unit: 'g',
      },
      {
        id: 'custom:canned-tomatoes',
        name: 'Canned Chopped Tomatoes',
        quantity: 400,
        unit: 'g',
      },
      {
        id: 'custom:beef-stock',
        name: 'Beef Stock',
        quantity: 300,
        unit: 'ml',
      },
      { id: 'tomato-paste', quantity: 30 },
      {
        id: 'custom:worcestershire-sauce',
        name: 'Worcestershire Sauce',
        quantity: 15,
        unit: 'ml',
      },
      { id: 'spaghetti', quantity: 350 },
      { id: 'parmesan', quantity: 30 },
      { id: 'salt', quantity: 2 },
      { id: 'black-pepper', quantity: 1 },
    ],
    instructions: [
      {
        text: 'Finely chop the onion and garlic. Heat the olive oil in a large pan and soften the onion for 4 minutes.',
        seconds: 240,
      },
      {
        text: 'Add the garlic and minced beef. Brown the beef, breaking it up with a spoon, for 5 minutes.',
        seconds: 300,
      },
      {
        text: 'Stir in the mushrooms, oregano, canned tomatoes, beef stock, tomato paste, Worcestershire sauce, salt and pepper. Cover and simmer for 30 minutes, stirring occasionally.',
        seconds: 1800,
      },
      {
        text: 'Cook the spaghetti in salted boiling water until al dente, following the packet instructions.',
        seconds: 660,
      },
      {
        text: 'Drain the pasta, toss it with the sauce and serve with grated Parmesan.',
        seconds: 120,
      },
    ],
  },
  {
    id: 'chicken-alfredo-primavera',
    title: 'Chicken Alfredo Primavera',
    category: 'Dinner',
    cuisine: 'Italian',
    cookingTime: 42,
    servings: 4,
    images: [
      'https://www.themealdb.com/images/media/meals/syqypv1486981727.jpg',
    ],
    ingredients: [
      { id: 'butter', quantity: 30 },
      { id: 'olive-oil', quantity: 45 },
      { id: 'chicken-breast', quantity: 600 },
      { id: 'salt', quantity: 3 },
      { id: 'black-pepper', quantity: 1 },
      { id: 'zucchini', quantity: 200 },
      { id: 'broccoli', quantity: 200 },
      { id: 'mushroom', quantity: 200 },
      { id: 'bell-pepper', quantity: 1 },
      { id: 'onion', quantity: 1 },
      { id: 'garlic', quantity: 3 },
      {
        id: 'custom:red-pepper-flakes',
        name: 'Red Pepper Flakes',
        quantity: 2,
        unit: 'g',
      },
      {
        id: 'custom:white-wine',
        name: 'Dry White Wine',
        quantity: 120,
        unit: 'ml',
      },
      { id: 'milk', quantity: 120 },
      { id: 'cream', quantity: 120 },
      { id: 'parmesan', quantity: 80 },
      { id: 'pasta', quantity: 400 },
      { id: 'parsley', quantity: 10 },
    ],
    instructions: [
      {
        text: 'Season the chicken breasts with salt and pepper. Heat half the butter and olive oil in a large skillet and cook the chicken for 5–6 minutes per side. Transfer to a board to rest.',
        seconds: 900,
      },
      {
        text: 'Boil the pasta in well-salted water until al dente. Reserve a splash of pasta water before draining.',
        seconds: 720,
      },
      {
        text: 'Sauté the onion, zucchini, broccoli, mushrooms and bell pepper in the remaining butter and oil for 5 minutes. Add the garlic and red pepper flakes and cook for 1 minute more.',
        seconds: 360,
      },
      {
        text: 'Pour in the white wine and reduce by half, about 3 minutes. Stir in the milk, cream and reserved pasta water, then simmer for 3 minutes.',
        seconds: 360,
      },
      {
        text: 'Slice the chicken. Toss the pasta with the sauce, Parmesan and chicken, then finish with chopped parsley.',
        seconds: 180,
      },
    ],
  },
  {
    id: 'honey-teriyaki-salmon',
    title: 'Honey Teriyaki Salmon',
    category: 'Dinner',
    cuisine: 'Japanese',
    cookingTime: 20,
    servings: 4,
    images: [
      'https://www.themealdb.com/images/media/meals/xxyupu1468262513.jpg',
    ],
    ingredients: [
      { id: 'salmon', quantity: 600 },
      { id: 'soy-sauce', quantity: 60 },
      { id: 'honey', quantity: 60 },
      { id: 'rice-vinegar', quantity: 30 },
      { id: 'garlic', quantity: 2 },
      { id: 'ginger', quantity: 10 },
      { id: 'sesame-seeds', quantity: 15 },
      { id: 'olive-oil', quantity: 15 },
      { id: 'spring-onion', quantity: 20 },
    ],
    instructions: [
      {
        text: 'Whisk the soy sauce, honey, rice vinegar, grated garlic and ginger. Coat the salmon and leave it to marinate for 10 minutes.',
        seconds: 600,
      },
      {
        text: 'Heat the oil in a skillet over medium heat. Cook the salmon for 3–4 minutes per side, brushing with the glaze, until cooked through and sticky.',
        seconds: 480,
      },
      {
        text: 'Sprinkle with sesame seeds and sliced spring onion. Serve with steamed rice.',
        seconds: 120,
      },
    ],
  },
  {
    id: 'salmon-avocado-salad',
    title: 'Salmon Avocado Salad',
    category: 'Lunch',
    cuisine: 'British',
    cookingTime: 16,
    servings: 4,
    images: ['https://www.themealdb.com/images/media/meals/1549542994.jpg'],
    ingredients: [
      { id: 'salmon', quantity: 400 },
      { id: 'avocado', quantity: 3 },
      { id: 'cucumber', quantity: 1 },
      { id: 'spinach', quantity: 200 },
      { id: 'mint', quantity: 10 },
      { id: 'lime', quantity: 1 },
      { id: 'honey', quantity: 10 },
      { id: 'olive-oil', quantity: 45 },
      { id: 'salt', quantity: 2 },
      { id: 'black-pepper', quantity: 1 },
    ],
    instructions: [
      {
        text: 'Whisk the lime zest and juice, honey, olive oil, salt and pepper into a dressing.',
        seconds: 180,
      },
      {
        text: 'Slice the avocado and cucumber. Divide the spinach, avocado and cucumber between plates and drizzle with half the dressing.',
        seconds: 300,
      },
      {
        text: 'Season the salmon and pan-sear for 3–4 minutes per side until crisp outside and moist inside. Top each salad with salmon, the remaining dressing and mint.',
        seconds: 480,
      },
    ],
  },
  {
    id: 'salmon-prawn-risotto',
    title: 'Salmon & Prawn Risotto',
    category: 'Dinner',
    cuisine: 'Italian',
    cookingTime: 33,
    servings: 3,
    images: [
      'https://www.themealdb.com/images/media/meals/xxrxux1503070723.jpg',
    ],
    ingredients: [
      { id: 'butter', quantity: 50 },
      { id: 'onion', quantity: 1 },
      { id: 'rice', quantity: 300 },
      {
        id: 'custom:white-wine',
        name: 'Dry White Wine',
        quantity: 125,
        unit: 'ml',
      },
      { id: 'vegetable-stock', quantity: 1000 },
      { id: 'lemon', quantity: 1 },
      { id: 'shrimp', quantity: 240 },
      { id: 'salmon', quantity: 150 },
      {
        id: 'custom:asparagus',
        name: 'Asparagus',
        quantity: 100,
        unit: 'g',
      },
      { id: 'parmesan', quantity: 50 },
      { id: 'salt', quantity: 2 },
      { id: 'black-pepper', quantity: 1 },
    ],
    instructions: [
      {
        text: 'Melt the butter in a deep pan and soften the onion for 4 minutes. Add the rice and stir until the grains are glossy.',
        seconds: 240,
      },
      {
        text: 'Pour in the wine and stir until absorbed. Add the hot stock a ladle at a time, stirring often, for about 20 minutes until the rice is creamy and tender.',
        seconds: 1320,
      },
      {
        text: 'Meanwhile, pan-sear the salmon and prawns for 3 minutes and blanch the asparagus.',
        seconds: 300,
      },
      {
        text: 'Stir the lemon zest and juice, pepper and Parmesan into the risotto. Fold in the salmon, prawns and asparagus, then serve.',
        seconds: 120,
      },
    ],
  },
  {
    id: 'chicken-fried-rice',
    title: 'Chicken Fried Rice',
    category: 'Dinner',
    cuisine: 'Chinese',
    cookingTime: 25,
    servings: 4,
    images: [
      'https://www.themealdb.com/images/media/meals/wuyd2h1765655837.jpg',
    ],
    ingredients: [
      { id: 'chicken-thigh', quantity: 450 },
      { id: 'salt', quantity: 3 },
      { id: 'black-pepper', quantity: 1 },
      { id: 'oil', quantity: 45 },
      { id: 'egg', quantity: 3 },
      { id: 'onion', quantity: 1 },
      { id: 'garlic', quantity: 2 },
      { id: 'ginger', quantity: 10 },
      { id: 'carrot', quantity: 100 },
      { id: 'peas', quantity: 100 },
      { id: 'jasmine-rice', quantity: 600 },
      { id: 'spring-onion', quantity: 30 },
      { id: 'five-spice', quantity: 2 },
      { id: 'soy-sauce', quantity: 40 },
      { id: 'sesame-oil', quantity: 5 },
    ],
    instructions: [
      {
        text: 'Dice the chicken and season with salt and pepper. Chop the onion, garlic, ginger and carrot. Use cold, day-old rice if possible.',
        seconds: 600,
      },
      {
        text: 'Heat a little oil in a wok and scramble the eggs. Transfer to a plate.',
        seconds: 180,
      },
      {
        text: 'Add more oil and stir-fry the chicken for 4–5 minutes. Transfer to a plate.',
        seconds: 300,
      },
      {
        text: 'Stir-fry the onion, garlic, ginger, carrot and peas for 3 minutes. Add the rice, five-spice, soy sauce and sesame oil and toss until hot.',
        seconds: 300,
      },
      {
        text: 'Return the chicken and eggs, add the spring onion and toss for 2 minutes. Serve immediately.',
        seconds: 120,
      },
    ],
  },
  {
    id: 'banana-pancakes',
    title: 'Banana Pancakes',
    category: 'Breakfast',
    cuisine: 'American',
    cookingTime: 12,
    servings: 2,
    images: [
      'https://www.themealdb.com/images/media/meals/sywswr1511383814.jpg',
    ],
    ingredients: [
      { id: 'banana', quantity: 1 },
      { id: 'egg', quantity: 2 },
      { id: 'baking-powder', quantity: 2 },
      {
        id: 'custom:vanilla-extract',
        name: 'Vanilla Extract',
        quantity: 2,
        unit: 'ml',
      },
      { id: 'oil', quantity: 5 },
      { id: 'walnut', quantity: 25 },
      {
        id: 'custom:raspberries',
        name: 'Raspberries',
        quantity: 125,
        unit: 'g',
      },
      { id: 'honey', quantity: 20 },
    ],
    instructions: [
      {
        text: 'Mash the banana until smooth, then whisk in the eggs, baking powder and vanilla.',
        seconds: 180,
      },
      {
        text: 'Heat a non-stick pan with a little oil. Spoon in the batter and cook for 1–2 minutes per side, until golden.',
        seconds: 480,
      },
      {
        text: 'Serve topped with walnuts, raspberries and a drizzle of honey.',
        seconds: 60,
      },
    ],
  },
  {
    id: 'nutty-chicken-curry',
    title: 'Nutty Chicken Curry',
    category: 'Dinner',
    cuisine: 'Indian',
    cookingTime: 20,
    servings: 4,
    images: [
      'https://www.themealdb.com/images/media/meals/yxsurp1511304301.jpg',
    ],
    ingredients: [
      { id: 'chili', quantity: 1 },
      { id: 'ginger', quantity: 10 },
      { id: 'garlic', quantity: 1 },
      { id: 'coriander', quantity: 20 },
      { id: 'oil', quantity: 15 },
      { id: 'chicken-breast', quantity: 600 },
      { id: 'peanut-butter', quantity: 75 },
      { id: 'chicken-stock', quantity: 150 },
      { id: 'greek-yogurt', quantity: 200 },
      { id: 'salt', quantity: 2 },
      { id: 'black-pepper', quantity: 1 },
      { id: 'rice', quantity: 300 },
    ],
    instructions: [
      {
        text: 'Blitz the chilli, ginger, garlic, coriander stalks and most of the leaves into a rough paste with a splash of water.',
        seconds: 180,
      },
      {
        text: 'Heat the oil and brown the chicken pieces for 3 minutes. Stir in the paste and cook for 1 minute.',
        seconds: 240,
      },
      {
        text: 'Add the peanut butter, stock and yogurt. Simmer gently for 10–12 minutes until the chicken is cooked and the sauce thickens.',
        seconds: 660,
      },
      {
        text: 'Stir in the remaining coriander. Serve with rice or mashed sweet potato.',
        seconds: 120,
      },
    ],
  },
  {
    id: 'margherita-pizza',
    title: 'Margherita Pizza',
    category: 'Dinner',
    cuisine: 'Italian',
    cookingTime: 42,
    servings: 2,
    images: [
      'https://www.themealdb.com/images/media/meals/x0lk931587671540.jpg',
    ],
    ingredients: [
      { id: 'water', quantity: 150 },
      { id: 'sugar', quantity: 5 },
      { id: 'custom:yeast', name: 'Fresh Yeast', quantity: 15, unit: 'g' },
      { id: 'flour', quantity: 225 },
      { id: 'salt', quantity: 7 },
      { id: 'olive-oil', quantity: 15 },
      {
        id: 'custom:passata',
        name: 'Tomato Passata',
        quantity: 80,
        unit: 'g',
      },
      { id: 'mozzarella', quantity: 70 },
      {
        id: 'custom:dried-oregano',
        name: 'Dried Oregano',
        quantity: 2,
        unit: 'g',
      },
      { id: 'basil', quantity: 10 },
      { id: 'black-pepper', quantity: 1 },
    ],
    instructions: [
      {
        text: 'Stir the sugar and yeast into the warm water. Leave for 10–15 minutes until frothy.',
        seconds: 600,
      },
      {
        text: 'Sift the flour and salt into a bowl, add the yeast water and olive oil, then knead for 10 minutes until smooth and silky.',
        seconds: 600,
      },
      {
        text: 'Rest the dough for 10 minutes. Stretch it onto a baking tray, spread with passata and top with mozzarella, oregano, black pepper and a drizzle of oil.',
        seconds: 600,
      },
      {
        text: 'Bake at 230°C for 10–12 minutes until the crust is golden and the cheese bubbles. Finish with fresh basil.',
        seconds: 720,
      },
    ],
  },
  {
    id: 'french-omelette',
    title: 'French Omelette',
    category: 'Breakfast',
    cuisine: 'French',
    cookingTime: 7,
    servings: 1,
    images: [
      'https://www.themealdb.com/images/media/meals/yvpuuy1511797244.jpg',
    ],
    ingredients: [
      { id: 'egg', quantity: 3 },
      { id: 'butter', quantity: 20 },
      { id: 'parmesan', quantity: 5 },
      { id: 'parsley', quantity: 5 },
      { id: 'custom:chives', name: 'Chives', quantity: 5, unit: 'g' },
      {
        id: 'custom:tarragon',
        name: 'Tarragon',
        quantity: 3,
        unit: 'g',
      },
      {
        id: 'custom:gruyere',
        name: 'Gruyère',
        quantity: 30,
        unit: 'g',
      },
      { id: 'salt', quantity: 1 },
      { id: 'black-pepper', quantity: 1 },
    ],
    instructions: [
      {
        text: 'Beat the eggs with the Parmesan, salt and pepper until just combined.',
        seconds: 120,
      },
      {
        text: 'Melt most of the butter in a non-stick pan over medium heat. Pour in the eggs and gently draw the set edges into the centre with a spatula until softly set.',
        seconds: 180,
      },
      {
        text: 'Scatter over the herbs and Gruyère, fold the omelette and slide it onto a plate. Glaze with the remaining butter and serve immediately.',
        seconds: 120,
      },
    ],
  },
];
