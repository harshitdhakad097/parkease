// Import React and hooks
import React, { useState } from "react";

// Import navigation hook
import { useNavigate } from "react-router-dom";

// BookingConfirm component
function BookingConfirm() {
  // Hook for navigation
  const navigate = useNavigate();

  // State for loading
  const [loading, setLoading] = useState(false);
  
  // State for error handling
  const [error, setError] = useState(null);

  // Get booking data from localStorage
  const bookingDataRaw = localStorage.getItem("booking");
  const bookingData = bookingDataRaw ? JSON.parse(bookingDataRaw) : null;

  // Validate booking data before rendering
  if (!bookingData) {
    return (
      <div style={styles.container}>
        <p style={styles.error}>❌ No booking data found. Please start a new booking.</p>
        <button
          style={styles.button}
          onClick={() => navigate("/")}
        >
          Go Back to Home
        </button>
      </div>
    );
  }

  // Destructure and validate booking data
  const { locationId, slotNumber, locationName, pricePerHour } = bookingData;
  
  // Validate all required fields exist and are valid
  if (!locationId || !slotNumber || !locationName || !pricePerHour) {
    return (
      <div style={styles.container}>
        <p style={styles.error}>❌ Invalid booking data. Required fields are missing.</p>
        <button
          style={styles.button}
          onClick={() => {
            localStorage.removeItem("booking");
            navigate("/");
          }}
        >
          Start Over
        </button>
      </div>
    );
  }

  // Validate price is a positive number
  if (typeof pricePerHour !== "number" || pricePerHour <= 0) {
    return (
      <div style={styles.container}>
        <p style={styles.error}>❌ Invalid price information.</p>
        <button
          style={styles.button}
          onClick={() => navigate("/")}
        >
          Go Back
        </button>
      </div>
    );
  }

  // Handle booking confirmation
  const handleConfirm = async () => {
    try {
      setLoading(true);
      setError(null);

      // Send booking request to backend API
      const response = await fetch("http://localhost:5000/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          locationId: locationId,
          slotNumber: slotNumber,
          locationName: locationName,
          pricePerHour: pricePerHour,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to create booking");
      }

      // Save QR code from API response
      const qrCode = result.qrCode || result.data?.qrCode;
      if (qrCode) {
        localStorage.setItem("qrCode", qrCode);
      }
      
      localStorage.removeItem("booking"); // Clear booking data

      // Navigate to QR code page
      navigate("/qrcode");
    } catch (error) {
      console.error("Error saving booking:", error);
      setError(error.message || "Failed to confirm booking. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2>✓ Confirm Your Booking</h2>

      {/* Error message */}
      {error && <p style={styles.error}>{error}</p>}

      {/* Booking summary */}
      <div style={styles.summary}>
        <p><strong>Location:</strong> {locationName}</p>
        <p><strong>Slot Number:</strong> {slotNumber}</p>
        <p><strong>Price:</strong> ₹{pricePerHour} / hour</p>
      </div>

      {/* Confirm button */}
      <button
        style={{...styles.button, opacity: loading ? 0.6 : 1, cursor: loading ? "not-allowed" : "pointer"}}
        onClick={handleConfirm}
        disabled={loading}
      >
        {loading ? "Confirming..." : "Confirm Booking"}
      </button>
      
      {/* Cancel button */}
      <button
        style={{...styles.cancelButton}}
        onClick={() => navigate("/")}
        disabled={loading}
      >
        Cancel
      </button>
    </div>
  );
}

// Inline styles
const styles = {
  container: {
    padding: "20px",
    maxWidth: "600px",
    margin: "0 auto",
  },
  message: {
    padding: "20px",
    fontSize: "18px",
  },
  error: {
    padding: "15px",
    backgroundColor: "#f8d7da",
    color: "#721c24",
    border: "1px solid #f5c6cb",
    borderRadius: "5px",
    marginBottom: "20px",
    fontSize: "16px",
  },
  summary: {
    backgroundColor: "#e7f3ff",
    border: "2px solid #b3d9ff",
    borderRadius: "8px",
    padding: "15px",
    marginBottom: "20px",
    fontSize: "16px",
  },
  button: {
    marginTop: "15px",
    marginRight: "10px",
    padding: "12px 20px",
    backgroundColor: "#28a745",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold",
  },
  cancelButton: {
    marginTop: "15px",
    padding: "12px 20px",
    backgroundColor: "#6c757d",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold",
  },
};

// Export component
export default BookingConfirm;