import { Link } from 'react-router';
import { routeList } from '../../router/routes.config';
import './Nav.css';

function Nav() {
  return (
    <nav className="HomeNav">
      {routeList.map((PageRoute) => {
        const cleanPath = PageRoute.path.slice(1);
        return (
          <Link key={PageRoute.path} to={PageRoute.path}>
            {cleanPath}
          </Link>
        );
      })}
    </nav>
  );
}

export default Nav;
