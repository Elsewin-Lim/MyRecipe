import { useRoutes } from 'react-router-dom';
import { customRoutes } from './routes.config';

function AppRoutes() {
  return useRoutes(customRoutes);
}

export default AppRoutes;
