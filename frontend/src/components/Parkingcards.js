// Import React
import React from "react";

// Import useNavigate from React Router for navigation
import { useNavigate } from "react-router-dom";

// ParkingCard component receives props
function ParkingCard({ name, address, totalSlots, pricePerHour, locationId }) {
  // Hook to navigate programmatically
  const navigate = useNavigate();

  // Function to handle button click
  const handleBooking = () => {
    // Navigate to slot selection page with locationId
    navigate(`/slots/${locationId}`);
  };

  return (
    // Card container
    <div style={styles.card}>
      
      {/* Parking Name */}
      <h2 style={styles.title}>{name}</h2>

      {/* Address */}
      <p style={styles.text}>{address}</p>

      {/* Total Slots */}
      <p style={styles.text}>Total Slots: {totalSlots}</p>

      {/* Price per hour */}
      <p style={styles.text}>₹{pricePerHour} / hour</p>

      {/* Book Now button */}
      <button style={styles.button} onClick={handleBooking}>
        Book Now
      </button>
    </div>
  );
}

// Inline styles for the card
const styles = {
  card: {
    border: "1px solid #ddd", // Light border
    borderRadius: "10px", // Rounded corners
    padding: "15px", // Inner spacing
    margin: "10px", // Space between cards
    width: "250px", // Fixed width
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)", // Soft shadow
    backgroundColor: "#fff", // White background
  },
  title: {
    marginBottom: "10px",
  },
  text: {
    margin: "5px 0",
    color: "#555",
  },
  button: {
    marginTop: "10px",
    padding: "8px 12px",
    backgroundColor: "#007bff", // Blue button
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

// Export component
export default ParkingCard;