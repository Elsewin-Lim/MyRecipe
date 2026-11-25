# MyRecipe

A browser-only recipe book built with React, Vite, paged.js, and react-pageflip-enhanced. Browse recipes as a page-flip book, cook step by step with a timer, save favorites, and build a shopping list. All data stays in the browser.

## Getting started

Requires Node.js 20+.

```bash
npm install
npm run dev
```

- `npm run build` — production build (base `/MyRecipe/`)
- `npm run lint` — ESLint
- `npm run check` — Prettier write

Lefthook formats and lints staged files on commit and push.

## Project layout

```text
src/
  App/          route pages
  components/   shared UI
  context/      app, recipe, and timer providers
  data/         recipe data, IndexedDB access, storage helpers
  router/       file-based routes
  utils/        shared utilities
DB/IndexDB.js   IndexedDB wrapper
```

- Pages are auto-registered by `src/router/routes.config.jsx`: `src/App/MyRecipe/MyRecipe.jsx` becomes `/MyRecipe`.
- Recipes live in IndexedDB (`data/recipeDatabase.js`). Drafts, book position, shopping list, and cooking sessions use the helpers in `data/` and `localStorage`/`sessionStorage`.
- The book is paginated with paged.js and then rendered with `react-pageflip-enhanced`.
