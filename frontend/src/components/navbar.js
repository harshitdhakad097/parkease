// Import React
import React from "react";

// Import Link from React Router for navigation without page reload
import { Link } from "react-router-dom";

// Navbar component
function Navbar() {
  return (
    // Main navbar container
    <nav style={styles.navbar}>
      
      {/* Left side - App Logo */}
      <div style={styles.logo}>
        <span style={styles.carEmoji}>🚗</span>
        <span style={styles.appName}>ParkEase</span>
      </div>

      {/* Right side - Navigation Links */}
      <div style={styles.links}>
        {/* Link to Home page */}
        <Link to="/" style={styles.link}>
          <span style={styles.linkText}>Home</span>
        </Link>

        {/* Link to My Bookings page */}
        <Link to="/my-bookings" style={styles.link}>
          <span style={styles.linkText}>My Bookings</span>
        </Link>
      </div>
    </nav>
  );
}

// Premium inline styles
const styles = {
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 40px",
    backgroundColor: "#0A0F1E", // Dark navy background
    borderBottom: "2px solid #1E90FF", // Electric blue subtle border
    boxShadow: "0 2px 20px rgba(30, 144, 255, 0.1)", // Subtle glow
    position: "sticky",
    top: 0,
    zIndex: 1000,
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    cursor: "pointer",
    transition: "transform 0.3s ease",
  },
  carEmoji: {
    fontSize: "28px",
    display: "flex",
    alignItems: "center",
  },
  appName: {
    fontSize: "24px",
    fontWeight: "800",
    color: "#fff",
    letterSpacing: "0.5px",
    background: "linear-gradient(135deg, #fff 0%, #1E90FF 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  },
  links: {
    display: "flex",
    gap: "30px",
    alignItems: "center",
  },
  link: {
    textDecoration: "none",
    position: "relative",
    display: "inline-block",
  },
  linkText: {
    color: "#fff",
    fontSize: "15px",
    fontWeight: "600",
    letterSpacing: "0.3px",
    transition: "color 0.3s ease",
    padding: "8px 0",
    borderBottom: "2px solid transparent",
    display: "inline-block",
    transition: "all 0.3s ease",
  },
};

// Add hover effect styling
const linkHoverStyle = {
  onMouseEnter: (e) => {
    e.target.style.color = "#1E90FF";
    e.target.style.borderBottomColor = "#1E90FF";
  },
  onMouseLeave: (e) => {
    e.target.style.color = "#fff";
    e.target.style.borderBottomColor = "transparent";
  },
};

// Enhanced Navbar with hover effects
function NavbarEnhanced() {
  return (
    <nav style={styles.navbar}>
      <div style={styles.logo}>
        <span style={styles.carEmoji}>🚗</span>
        <span style={styles.appName}>ParkEase</span>
      </div>

      <div style={styles.links}>
        <Link to="/" style={styles.link}>
          <span 
            style={styles.linkText}
            onMouseEnter={(e) => {
              e.target.style.color = "#1E90FF";
              e.target.style.borderBottom = "2px solid #1E90FF";
            }}
            onMouseLeave={(e) => {
              e.target.style.color = "#fff";
              e.target.style.borderBottom = "2px solid transparent";
            }}
          >
            Home
          </span>
        </Link>

        <Link to="/my-bookings" style={styles.link}>
          <span 
            style={styles.linkText}
            onMouseEnter={(e) => {
              e.target.style.color = "#1E90FF";
              e.target.style.borderBottom = "2px solid #1E90FF";
            }}
            onMouseLeave={(e) => {
              e.target.style.color = "#fff";
              e.target.style.borderBottom = "2px solid transparent";
            }}
          >
            My Bookings
          </span>
        </Link>
      </div>
    </nav>
  );
}

// Export component
export default NavbarEnhanced;