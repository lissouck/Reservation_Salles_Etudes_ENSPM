// src/components/Navbar.jsx
// Barre de navigation principale

import { Link, NavLink } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-inner container">
        {/* Logo / titre */}
        <Link to="/" className="navbar-brand">
          <span className="navbar-icon">🏛️</span>
          <div className="navbar-title-block">
            <span className="navbar-title">RéservSalles</span>
            <span className="navbar-sub">ENSPM Maroua</span>
          </div>
        </Link>

        {/* Liens de navigation */}
        <ul className="navbar-links">
          <li>
            <NavLink
              to="/"
              end
              className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
            >
              Salles
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin"
              className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
            >
              Admin
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
