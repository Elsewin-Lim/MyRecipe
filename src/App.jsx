import { BrowserRouter } from 'react-router';
import { RecipeProvider } from './context/RecipeProvider';
import AppRoutes from './router/AppRouter';
import Nav from './components/Nav/Nav';

function App() {
  return (
    <RecipeProvider>
      <BrowserRouter>
        <Nav />
        <main>
          <AppRoutes />
        </main>
      </BrowserRouter>
    </RecipeProvider>
  );
}

export default App;
