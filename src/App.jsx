import { BrowserRouter } from 'react-router';
import { RecipeProvider } from './context/RecipeProvider';
import { AppProvider } from './context/StoreContext';
import { TimerProvider } from './context/TimerProvider';
import AppRoutes from './router/AppRouter';
import Nav from './components/Nav/Nav';

function App() {
  return (
    <AppProvider>
      <TimerProvider>
        <RecipeProvider>
          <BrowserRouter>
            <Nav />
            <main>
              <AppRoutes />
            </main>
          </BrowserRouter>
        </RecipeProvider>
      </TimerProvider>
    </AppProvider>
  );
}

export default App;
