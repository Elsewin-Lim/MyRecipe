import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { seedSampleRecipes } from './utils/seedSampleRecipes';

const container = document.getElementById('root');

async function bootstrap() {
  try {
    await seedSampleRecipes();
  } finally {
    createRoot(container).render(
      <StrictMode>
        <App />
      </StrictMode>
    );
  }
}

bootstrap();
