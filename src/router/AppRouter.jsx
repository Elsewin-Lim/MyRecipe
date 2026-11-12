import { useRoutes } from 'react-router';
import { customRoutes } from './routes.config';

function AppRoutes() {
  return useRoutes(customRoutes);
}

export default AppRoutes;
