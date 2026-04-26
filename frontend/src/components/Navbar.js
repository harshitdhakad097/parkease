import React from "react";
import { NavLink } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">
      <NavLink to="/" className="navbar-brand">
        <div className="navbar-logo">PE</div>
        <div>
          <div className="navbar-title">ParkEase</div>
          <div className="navbar-tag">Smart parking, simplified</div>
        </div>
      </NavLink>

      <div className="navbar-links">
        <NavLink to="/" className={({ isActive }) => (isActive ? "navbar-link active" : "navbar-link")}>
          Home
        </NavLink>
        <NavLink
          to="/my-bookings"
          className={({ isActive }) => (isActive ? "navbar-link active" : "navbar-link")}
        >
          My Bookings
        </NavLink>
      </div>
    </nav>
  );
}

export default Navbar;
