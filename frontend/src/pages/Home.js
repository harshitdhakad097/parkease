// Import React and hooks
import React, { useEffect, useState } from "react";

// Import Firestore functions
import { collection, getDocs } from "firebase/firestore";

// Import database instance
import { db } from "../firebase";

// Import ParkingCard component
import ParkingCard from "../components/Parkingcards";

// Home component
function Home() {
  // State to store parking locations
  const [locations, setLocations] = useState([]);

  // State for loading
  const [loading, setLoading] = useState(true);

  // State for error
  const [error, setError] = useState(null);

  // State for search filter
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch data on component mount
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        // Fetch from backend API instead of direct Firestore
        const response = await fetch("http://localhost:5000/api/parking");
        
        if (!response.ok) {
          throw new Error("Failed to fetch parking locations from server");
        }

        const result = await response.json();
        
        if (result.success && result.data) {
          setLocations(result.data);
        } else {
          throw new Error(result.message || "No data received");
        }
      } catch (err) {
        // Fallback to Firestore if API fails
        console.warn("API fetch failed, trying Firestore directly:", err);
        try {
          const querySnapshot = await getDocs(collection(db, "parkingLocations"));
          const data = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setLocations(data);
        } catch (firebaseErr) {
          console.error("Both API and Firestore failed:", firebaseErr);
          setError("Failed to load parking locations");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, []);

  // Filter locations based on search query
  const filteredLocations = locations.filter((loc) =>
    loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    loc.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Show loading message
  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingContainer}>
          <div style={styles.spinner}></div>
          <p style={styles.loadingText}>Finding parking spots for you...</p>
        </div>
      </div>
    );
  }

  // Show error message
  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.errorContainer}>
          <p style={styles.errorText}>⚠️ {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Hero Section */}
      <div style={styles.heroSection}>
        <div style={styles.heroContent}>
          <h1 style={styles.heroTitle}>Find Your Perfect Parking Spot</h1>
          <p style={styles.heroSubtitle}>Book in seconds. Park with confidence.</p>
          
          {/* Search Bar */}
          <div style={styles.searchContainer}>
            <span style={styles.searchIcon}>🔍</span>
            <input
              type="text"
              placeholder="Search by location or address..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={styles.searchInput}
            />
          </div>

          {/* Results Info */}
          {filteredLocations.length > 0 && (
            <p style={styles.resultsInfo}>
              Showing {filteredLocations.length} parking spot{filteredLocations.length !== 1 ? "s" : ""}
            </p>
          )}
        </div>
      </div>

      {/* Parking Cards Section */}
      <div style={styles.cardsSection}>
        {filteredLocations.length > 0 ? (
          <div style={styles.cardContainer}>
            {filteredLocations.map((loc) => (
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
        ) : (
          <div style={styles.noResultsContainer}>
            <p style={styles.noResultsText}>😕 No parking spots found</p>
            <p style={styles.noResultsSubtext}>Try adjusting your search criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Premium inline styles
const styles = {
  container: {
    backgroundColor: "#0A0F1E",
    minHeight: "100vh",
    color: "#fff",
  },
  heroSection: {
    background: "linear-gradient(135deg, #0A0F1E 0%, #1A1F35 100%)",
    borderBottom: "2px solid rgba(30, 144, 255, 0.2)",
    padding: "80px 40px",
    textAlign: "center",
    position: "relative",
    overflow: "hidden",
  },
  heroContent: {
    maxWidth: "800px",
    margin: "0 auto",
    position: "relative",
    zIndex: 2,
  },
  heroTitle: {
    fontSize: "48px",
    fontWeight: "900",
    marginBottom: "16px",
    letterSpacing: "-1px",
    background: "linear-gradient(135deg, #fff 0%, #1E90FF 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  },
  heroSubtitle: {
    fontSize: "20px",
    color: "#B0B8C8",
    marginBottom: "40px",
    fontWeight: "500",
    letterSpacing: "0.3px",
  },
  searchContainer: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "#1F2540",
    border: "2px solid rgba(30, 144, 255, 0.3)",
    borderRadius: "12px",
    padding: "0 20px",
    marginBottom: "24px",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 20px rgba(30, 144, 255, 0.1)",
  },
  searchIcon: {
    fontSize: "20px",
    marginRight: "12px",
  },
  searchInput: {
    flex: 1,
    backgroundColor: "transparent",
    border: "none",
    color: "#fff",
    fontSize: "16px",
    padding: "16px 0",
    outline: "none",
    fontWeight: "500",
  },
  resultsInfo: {
    fontSize: "14px",
    color: "#1E90FF",
    fontWeight: "600",
    letterSpacing: "0.3px",
  },
  cardsSection: {
    padding: "60px 40px",
  },
  cardContainer: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: "24px",
  },
  noResultsContainer: {
    textAlign: "center",
    padding: "80px 40px",
  },
  noResultsText: {
    fontSize: "32px",
    fontWeight: "700",
    marginBottom: "12px",
    color: "#fff",
  },
  noResultsSubtext: {
    fontSize: "16px",
    color: "#B0B8C8",
    fontWeight: "500",
  },
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "60vh",
    gap: "20px",
  },
  spinner: {
    width: "50px",
    height: "50px",
    border: "4px solid rgba(30, 144, 255, 0.2)",
    borderTop: "4px solid #1E90FF",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  loadingText: {
    fontSize: "18px",
    color: "#B0B8C8",
    fontWeight: "600",
  },
  errorContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "60vh",
  },
  errorText: {
    fontSize: "20px",
    color: "#FF6B6B",
    fontWeight: "700",
    backgroundColor: "rgba(255, 107, 107, 0.1)",
    padding: "20px 30px",
    borderRadius: "12px",
    border: "2px solid rgba(255, 107, 107, 0.3)",
  },
};

// CSS animation for spinner
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;
document.head.appendChild(styleSheet);

// Export Home component
export default Home;