import { Link } from 'react-router';
import { navLinks } from '../../config/nav';
import './Nav.css';

function Nav() {
  return (
    <nav className="HomeNav" aria-label="Main navigation">
      {navLinks.map(({ path, label }) => (
        <Link key={path} to={path}>
          {label}
        </Link>
      ))}
    </nav>
  );
}

export default Nav;
