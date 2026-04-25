// Import React and hooks
import React, { useEffect, useState } from "react";

// Import Firestore functions
import { collection, getDocs } from "firebase/firestore";

// Import database instance
import { db } from "../firebase";

// Import ParkingCard component
import ParkingCard from "../components/ParkingCard";

// Home component
function Home() {
  // State to store parking locations
  const [locations, setLocations] = useState([]);

  // State for loading
  const [loading, setLoading] = useState(true);

  // State for error
  const [error, setError] = useState(null);

  // Fetch data on component mount
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        // Reference to "parkingLocations" collection
        const querySnapshot = await getDocs(collection(db, "parkingLocations"));

        // Convert Firestore data into array
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id, // document ID
          ...doc.data(), // document fields
        }));

        // Save data to state
        setLocations(data);
      } catch (err) {
        // Handle error
        console.error(err);
        setError("Failed to load parking locations");
      } finally {
        // Stop loading
        setLoading(false);
      }
    };

    fetchLocations();
  }, []);

  // Show loading message
  if (loading) {
    return <p style={styles.message}>Loading parking locations...</p>;
  }

  // Show error message
  if (error) {
    return <p style={styles.error}>{error}</p>;
  }

  return (
    <div style={styles.container}>
      {/* Page Heading */}
      <h1>Find Parking Near You</h1>

      {/* Parking Cards Container */}
      <div style={styles.cardContainer}>
        {locations.map((loc) => (
          <ParkingCard
            key={loc.id}
            locationId={loc.id}
            name={loc.name}
            address={loc.address}
            totalSlots={loc.totalSlots}
            pricePerHour={loc.pricePerHour}
          />
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
    flexWrap: "wrap", // Wrap cards to next line
  },
  message: {
    padding: "20px",
    fontSize: "18px",
  },
  error: {
    padding: "20px",
    color: "red",
    fontSize: "18px",
  },
};

// Export Home component
export default Home;