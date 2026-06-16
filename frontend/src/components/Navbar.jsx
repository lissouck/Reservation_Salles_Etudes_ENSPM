// src/components/Navbar.jsx
// Barre de navigation principale

import { Link, NavLink } from 'react-router-dom';
import { isAuthenticated, logout } from '../utils/auth';
import './Navbar.css';

const Navbar = () => {
  const loggedIn = isAuthenticated();

  return (
    <nav className="navbar">
      <div className="navbar-inner container">
        <Link to="/" className="navbar-brand">
          <img src="/logo.png" alt="logo" className="navbar-icon-img" />
          <div className="navbar-title-block">
            <span className="navbar-title">ReservSalles</span>
            <span className="navbar-sub">ENSP Maroua</span>
          </div>
        </Link>
        <ul className="navbar-links">
          <li>
            <NavLink to="/" end className={({ isActive }) =>
              isActive ? 'nav-link active' : 'nav-link'}>
              Salles
            </NavLink>
          </li>
          {loggedIn ? (
            <>
              <li>
                <NavLink to="/admin" className={({ isActive }) =>
                  isActive ? 'nav-link active' : 'nav-link'}>
                  Admin
                </NavLink>
              </li>
              <li>
                <button className="nav-link nav-logout" onClick={logout}>
                  Deconnexion
                </button>
              </li>
            </>
          ) : (
            <li>
              <NavLink to="/login" className={({ isActive }) =>
                isActive ? 'nav-link active' : 'nav-link'}>
                Admin
              </NavLink>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;