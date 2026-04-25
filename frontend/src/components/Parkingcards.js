// Import React
import React from "react";

// Import useNavigate from React Router for navigation
import { useNavigate } from "react-router-dom";

// ParkingCard component receives props
function ParkingCard({ name, address, totalSlots, pricePerHour, locationId }) {
  // Hook to navigate programmatically
  const navigate = useNavigate();

  // State for hover effect
  const [isHovered, setIsHovered] = React.useState(false);

  // Function to handle button click
  const handleBooking = () => {
    // Navigate to slot selection page with locationId
    navigate(`/slots/${locationId}`);
  };

  return (
    // Card container with hover effect
    <div 
      style={{
        ...styles.card,
        ...(isHovered ? styles.cardHover : {})
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      
      {/* Parking Name - Premium Title */}
      <h2 style={styles.title}>{name}</h2>

      {/* Address with Pin Icon */}
      <div style={styles.infoRow}>
        <span style={styles.icon}>📍</span>
        <p style={styles.text}>{address}</p>
      </div>

      {/* Total Slots */}
      <div style={styles.infoRow}>
        <span style={styles.icon}>🅿️</span>
        <p style={styles.text}>{totalSlots} slots available</p>
      </div>

      {/* Price per hour with Clock Icon */}
      <div style={styles.infoRow}>
        <span style={styles.icon}>⏱️</span>
        <p style={styles.priceText}>₹{pricePerHour} / hour</p>
      </div>

      {/* Divider Line */}
      <div style={styles.divider}></div>

      {/* Book Now button - Full Width */}
      <button 
        style={{
          ...styles.button,
          ...(isHovered ? styles.buttonHover : {})
        }}
        onClick={handleBooking}
      >
        <span style={styles.buttonText}>Book Now</span>
        <span style={styles.buttonArrow}>→</span>
      </button>
    </div>
  );
}

// Premium inline styles for the card
const styles = {
  card: {
    backgroundColor: "#1A1F35", // Dark card background
    border: "1px solid rgba(30, 144, 255, 0.2)", // Subtle blue border
    borderRadius: "16px",
    padding: "24px",
    margin: "16px",
    width: "320px",
    minHeight: "280px",
    display: "flex",
    flexDirection: "column",
    boxShadow: "0 8px 32px rgba(30, 144, 255, 0.08)", // Glow effect
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    cursor: "pointer",
    position: "relative",
    overflow: "hidden",
  },
  cardHover: {
    borderColor: "rgba(30, 144, 255, 0.5)",
    boxShadow: "0 16px 48px rgba(30, 144, 255, 0.15)", // Enhanced glow on hover
    transform: "translateY(-8px)", // Lift effect
    backgroundColor: "#1F2540",
  },
  title: {
    marginBottom: "16px",
    fontSize: "22px",
    fontWeight: "700",
    color: "#fff",
    letterSpacing: "0.3px",
  },
  infoRow: {
    display: "flex",
    alignItems: "flex-start",
    gap: "12px",
    marginBottom: "12px",
  },
  icon: {
    fontSize: "18px",
    marginTop: "2px",
    minWidth: "20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    margin: 0,
    color: "#B0B8C8",
    fontSize: "14px",
    fontWeight: "500",
    lineHeight: "1.5",
  },
  priceText: {
    margin: 0,
    color: "#1E90FF",
    fontSize: "16px",
    fontWeight: "700",
    lineHeight: "1.5",
  },
  divider: {
    height: "1px",
    backgroundColor: "rgba(30, 144, 255, 0.1)",
    margin: "16px 0",
  },
  button: {
    marginTop: "auto",
    padding: "14px 20px",
    backgroundColor: "#1E90FF",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "15px",
    letterSpacing: "0.5px",
    transition: "all 0.3s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    width: "100%",
    boxShadow: "0 4px 15px rgba(30, 144, 255, 0.3)",
  },
  buttonHover: {
    backgroundColor: "#0077CC",
    boxShadow: "0 8px 25px rgba(30, 144, 255, 0.5)",
    transform: "scale(1.02)",
  },
  buttonText: {
    fontWeight: "700",
  },
  buttonArrow: {
    fontSize: "18px",
    fontWeight: "bold",
  },
};

// Export component
export default ParkingCard;