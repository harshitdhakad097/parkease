// Import React and hooks
import React, { useEffect, useState } from "react";

// Import router hooks
import { useParams, useNavigate } from "react-router-dom";

// Import Firestore functions
import { doc, getDoc } from "firebase/firestore";

// Import database instance
import { db } from "../firebase";

// Import SlotGrid component
import SlotGrid from "../components/SlotGrid";

// SlotSelection component
function SlotSelection() {
  // Get locationId from URL
  const { locationId } = useParams();

  // Hook to navigate programmatically
  const navigate = useNavigate();

  // State to store location details
  const [location, setLocation] = useState(null);

  // State to store slots
  const [slots, setSlots] = useState([]);

  // State for loading
  const [loading, setLoading] = useState(true);

  // Fetch location details on mount
  useEffect(() => {
    const fetchLocation = async () => {
      try {
        // Reference to specific document
        const docRef = doc(db, "parkingLocations", locationId);

        // Fetch document
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          // Save location data
          const data = docSnap.data();
          setLocation(data);

          // Generate 20 demo slots (A1 to A20)
          const generatedSlots = Array.from({ length: 20 }, (_, i) => {
            return {
              slotNumber: `A${i + 1}`, // A1, A2, ..., A20
              isBooked: Math.random() < 0.3, // Randomly mark ~30% as booked
            };
          });

          setSlots(generatedSlots);
        } else {
          console.error("Location not found");
        }
      } catch (error) {
        console.error("Error fetching location:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLocation();
  }, [locationId]);

  // Handle slot selection
  const handleSlotSelect = (slotNumber) => {
    // Save booking info to localStorage
    localStorage.setItem(
      "booking",
      JSON.stringify({
        locationId: locationId,
        slotNumber: slotNumber,
        locationName: location.name,
        pricePerHour: location.pricePerHour,
      })
    );

    // Navigate to confirmation page
    navigate("/confirm");
  };

  // Loading state
  if (loading) {
    return <p style={styles.message}>Loading slots...</p>;
  }

  return (
    <div style={styles.container}>
      {/* Show location name */}
      <h2>{location?.name}</h2>

      {/* Slot grid */}
      <SlotGrid slots={slots} onSlotSelect={handleSlotSelect} />
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
};

// Export component
export default SlotSelection;