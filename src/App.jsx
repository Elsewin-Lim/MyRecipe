import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './router/AppRouter';
import Nav from './components/Nav/Nav';

function App() {
  return (
    <BrowserRouter>
      <Nav />
      <main>
        <AppRoutes />
      </main>
    </BrowserRouter>
  );
}

export default App;
