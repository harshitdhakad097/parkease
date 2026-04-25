// Import React and hooks
import React, { useState } from "react";

// Import navigation hook
import { useNavigate } from "react-router-dom";

// Import Firestore functions
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

// Import database instance
import { db } from "../firebase";

// BookingConfirm component
function BookingConfirm() {
  // Hook for navigation
  const navigate = useNavigate();

  // State for loading
  const [loading, setLoading] = useState(false);

  // Get booking data from localStorage
  const bookingData = JSON.parse(localStorage.getItem("booking"));

  // If no booking found
  if (!bookingData) {
    return <p style={styles.message}>No booking data found.</p>;
  }

  // Destructure booking data
  const { locationId, slotNumber, locationName, pricePerHour } = bookingData;

  // Function to generate random QR code string
  const generateQRCode = () => {
    return "QR_" + Math.random().toString(36).substring(2, 10);
  };

  // Handle booking confirmation
  const handleConfirm = async () => {
    try {
      setLoading(true);

      // Generate QR code string
      const qrCode = generateQRCode();

      // Save booking to Firestore
      await addDoc(collection(db, "bookings"), {
        locationId: locationId,
        slotNumber: slotNumber,
        locationName: locationName,
        status: "confirmed",
        createdAt: serverTimestamp(), // Firebase timestamp
        qrCode: qrCode,
      });

      // Save QR code to localStorage for next page
      localStorage.setItem("qrCode", qrCode);

      // Navigate to QR code page
      navigate("/qrcode");
    } catch (error) {
      console.error("Error saving booking:", error);
      alert("Failed to confirm booking");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2>Confirm Your Booking</h2>

      {/* Booking summary */}
      <p><strong>Location:</strong> {locationName}</p>
      <p><strong>Slot:</strong> {slotNumber}</p>
      <p><strong>Price:</strong> ₹{pricePerHour} / hour</p>

      {/* Confirm button */}
      <button
        style={styles.button}
        onClick={handleConfirm}
        disabled={loading}
      >
        {loading ? "Confirming..." : "Confirm Booking"}
      </button>
    </div>
  );
}

// Inline styles
const styles = {
  container: {
    padding: "20px",
  },
  message: {
    padding: "20px",
    fontSize: "18px",
  },
  button: {
    marginTop: "15px",
    padding: "10px 15px",
    backgroundColor: "#28a745",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

// Export component
export default BookingConfirm;