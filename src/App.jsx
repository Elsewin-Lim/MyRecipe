import { BrowserRouter } from 'react-router';
import { RecipeProvider } from './context/RecipeProvider';
import { AppProvider } from './context/StoreContext';
import AppRoutes from './router/AppRouter';
import Nav from './components/Nav/Nav';

function App() {
  return (
    <AppProvider>
      <RecipeProvider>
        <BrowserRouter>
          <Nav />
          <main>
            <AppRoutes />
          </main>
        </BrowserRouter>
      </RecipeProvider>
    </AppProvider>
  );
}

export default App;
