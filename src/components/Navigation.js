import React from 'react';
import { NavLink } from 'react-router-dom';

const Navigation = () => {
  return (
    <nav className="nav">
      <div className="nav-container">
        <div className="nav-brand">
          <img src="/images/safesip-logo.png" alt="SafeSip" className="nav-logo" />
          <span>SafeSip</span>
        </div>
        <div className="nav-links">
          <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>
            Home
          </NavLink>
          <NavLink to="/calculator" className={({ isActive }) => isActive ? 'active' : ''}>
            Calculator
          </NavLink>
          <NavLink to="/about" className={({ isActive }) => isActive ? 'active' : ''}>
            About
          </NavLink>
          <NavLink to="/gis" className={({ isActive }) => isActive ? 'active' : ''}>
            Water Quality Map
          </NavLink>
          <NavLink to="/outputs" className={({ isActive }) => isActive ? 'active' : ''}>
            Past Data Insights
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
