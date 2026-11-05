import './App.css';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './router/AppRouter';
import Nav from './components/Nav/Nav';
function App() {
  return (
    <BrowserRouter>
      {/* Navigation bar using Link components */}
      <Nav />
      {/* The view container where useRoutes swaps components */}
      <main>
        <AppRoutes />
      </main>
    </BrowserRouter>
  );
}

export default App;
