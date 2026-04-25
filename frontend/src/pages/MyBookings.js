// Import React and hooks
import React, { useEffect, useState } from "react";

// Import Firestore functions
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
        // Get all documents from "bookings" collection
        const querySnapshot = await getDocs(collection(db, "bookings"));

        // Convert Firestore docs to array
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Save bookings to state
        setBookings(data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
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