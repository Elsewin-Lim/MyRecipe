import { Navigate } from 'react-router';

const pages = import.meta.glob('../App/**/*.jsx', { eager: true });

export const routeList = Object.keys(pages)
  .map((filePath) => {
    const segments = filePath
      .replace(/^\.\.\/App/, '')
      .replace(/\.jsx$/, '')
      .split('/')
      .filter(Boolean);

    if (segments.length < 2) return null;

    if (segments[segments.length - 1] === segments[segments.length - 2]) {
      segments.pop();
    }

    const Component = pages[filePath].default;

    return {
      path: '/' + segments.join('/'),
      element: <Component />,
    };
  })
  .filter(Boolean);

export const customRoutes = [
  { path: '/', element: <Navigate to="/MyRecipe" replace /> },
  ...routeList,
  { path: '*', element: <div>Page Not FoundðŸ¥²</div> },
];
