import React from 'react';
import './Navbar.css';

const Navbar = () => {
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
        <button className="btn-login">Login</button>
        <button className="btn-register">Register</button>
      </div>
    </nav>
  );
};

export default Navbar;
