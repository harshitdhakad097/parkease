// Import React
import React from "react";

// Import Link from React Router for navigation without page reload
import { Link } from "react-router-dom";

// Navbar component
function Navbar() {
  return (
    // Main navbar container
    <nav style={styles.navbar}>
      
      {/* Left side - App Name */}
      <div style={styles.logo}>
        ParkEase 🚗
      </div>

      {/* Right side - Navigation Links */}
      <div style={styles.links}>
        {/* Link to Home page */}
        <Link to="/" style={styles.link}>
          Home
        </Link>

        {/* Link to My Bookings page */}
        <Link to="/my-bookings" style={styles.link}>
          My Bookings
        </Link>
      </div>
    </nav>
  );
}

// Inline styles object
const styles = {
  navbar: {
    display: "flex", // Align items horizontally
    justifyContent: "space-between", // Space between logo and links
    alignItems: "center", // Vertically center items
    padding: "10px 20px", // Spacing inside navbar
    backgroundColor: "#333", // Dark background
    color: "#fff", // White text
  },
  logo: {
    fontSize: "20px", // Bigger text
    fontWeight: "bold", // Bold text
  },
  links: {
    display: "flex", // Align links in a row
    gap: "15px", // Space between links
  },
  link: {
    color: "#fff", // White text
    textDecoration: "none", // Remove underline
    fontSize: "16px",
  },
};

// Export Navbar component
export default Navbar;