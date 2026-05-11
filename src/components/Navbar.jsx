import React from 'react';
import '../css/Navbar.css';

const Navbar = ({ user, onLoginClick, onRegisterClick, onLogout }) => {
  return (
    <nav className="navbar container">
      <div className="navbar-logo">
        <svg viewBox="0 0 24 24" fill="var(--secondary-orange)" width="28" height="28">
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
        </svg>
        <span className="logo-text">EventHub</span>
      </div>
      
      <ul className="navbar-links">
        <li><a href="#" className="active">Home</a></li>
        <li><a href="#">About</a></li>
        <li><a href="#">Events</a></li>
        <li><a href="#">Participants</a></li>
      </ul>
      
      <div className="navbar-actions">
        {user ? (
          <div className="user-profile">
            <span className="user-name">Hi, {user.name}</span>
            <button className="btn-logout" onClick={onLogout}>Logout</button>
          </div>
        ) : (
          <>
            <button className="btn-login" onClick={onLoginClick}>Login</button>
            <button className="btn-register" onClick={onRegisterClick}>Register</button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
