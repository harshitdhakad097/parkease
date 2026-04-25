// Import React and hooks
import React, { useEffect, useState } from "react";

// Import Firestore functions (kept as fallback)
import { collection, getDocs } from "firebase/firestore";

// Import database instance
import { db } from "../firebase";

// MyBookings component
function MyBookings() {
  // State to store bookings
  const [bookings, setBookings] = useState([]);

  // State for loading
  const [loading, setLoading] = useState(true);

  // Fetch bookings on component mount
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        // Fetch from backend API
        const response = await fetch("http://localhost:5000/api/bookings");
        
        if (!response.ok) {
          throw new Error("Failed to fetch bookings from server");
        }

        const result = await response.json();
        
        if (result.success && result.data) {
          setBookings(result.data);
        } else {
          throw new Error(result.message || "No data received");
        }
      } catch (error) {
        // Fallback to Firestore if API fails
        console.warn("API fetch failed, trying Firestore directly:", error);
        try {
          const querySnapshot = await getDocs(collection(db, "bookings"));
          const data = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setBookings(data);
        } catch (firebaseErr) {
          console.error("Both API and Firestore failed:", firebaseErr);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  // Show loading message
  if (loading) {
    return <p style={styles.message}>Loading bookings...</p>;
  }

  // If no bookings found
  if (bookings.length === 0) {
    return <p style={styles.message}>No bookings yet</p>;
  }

  return (
    <div style={styles.container}>
      <h2>My Bookings</h2>

      {/* Display each booking */}
      <div style={styles.cardContainer}>
        {bookings.map((booking) => (
          <div key={booking.id} style={styles.card}>
            
            {/* Location Name */}
            <h3>{booking.locationName}</h3>

            {/* Slot Number */}
            <p><strong>Slot:</strong> {booking.slotNumber}</p>

            {/* Status */}
            <p><strong>Status:</strong> {booking.status}</p>

            {/* Created At */}
            <p>
              <strong>Booked At:</strong>{" "}
              {booking.createdAt?.seconds
                ? new Date(booking.createdAt.seconds * 1000).toLocaleString()
                : "N/A"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

// Inline styles
const styles = {
  container: {
    padding: "20px",
  },
  cardContainer: {
    display: "flex",
    flexWrap: "wrap",
  },
  card: {
    border: "1px solid #ddd",
    borderRadius: "10px",
    padding: "15px",
    margin: "10px",
    width: "250px",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
  },
  message: {
    padding: "20px",
    fontSize: "18px",
  },
};

// Export component
export default MyBookings;