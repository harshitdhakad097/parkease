// Import React
import React from "react";

// Import navigation hook
import { useNavigate } from "react-router-dom";

// Import QRCode component from qrcode.react
import QRCode from "qrcode.react";

// QRCodePage component
function QRCodePage() {
  // Hook for navigation
  const navigate = useNavigate();

  // Get QR code string from localStorage
  const qrCode = localStorage.getItem("qrCode");

  // If no QR code found
  if (!qrCode) {
    return <p style={styles.message}>No QR code found.</p>;
  }

  return (
    <div style={styles.container}>
      {/* Success message */}
      <h2>Booking Confirmed! ✅</h2>

      {/* QR Code display */}
      <div style={styles.qrContainer}>
        <QRCode value={qrCode} size={200} />
      </div>

      {/* Instructions */}
      <p style={styles.text}>
        Show this QR code at the parking gate
      </p>

      {/* Button to navigate to My Bookings */}
      <button
        style={styles.button}
        onClick={() => navigate("/my-bookings")}
      >
        View My Bookings
      </button>
    </div>
  );
}

// Inline styles
const styles = {
  container: {
    padding: "20px",
    textAlign: "center",
  },
  qrContainer: {
    margin: "20px 0",
  },
  text: {
    fontSize: "16px",
    marginBottom: "15px",
  },
  message: {
    padding: "20px",
    fontSize: "18px",
  },
  button: {
    padding: "10px 15px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

// Export component
export default QRCodePage;