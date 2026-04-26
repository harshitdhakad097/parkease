import React, { useEffect, useMemo, useState } from "react";
import ParkingCard from "../components/ParkingCard";

const API_URL = process.env.REACT_APP_API_URL || "";
const PUNE_CENTER = { lat: 18.5204, lng: 73.8567 };
const CATEGORIES = ["All", "Mall", "Hospital", "Office", "Stadium"];

const getLocationCategory = (location) => {
  const value = `${location.category || location.type || location.name || location.landmark || ""}`.toLowerCase();
  if (value.includes("mall") || value.includes("market")) return "Mall";
  if (value.includes("hospital") || value.includes("clinic")) return "Hospital";
  if (value.includes("office") || value.includes("business") || value.includes("corporate")) return "Office";
  if (value.includes("stadium") || value.includes("ground") || value.includes("arena")) return "Stadium";
  return "All";
};

function Home() {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [userLocation, setUserLocation] = useState(null);
  const [searchCenter, setSearchCenter] = useState(PUNE_CENTER);
  const [statusMessage, setStatusMessage] = useState("Showing premium spots near you.");

  useEffect(() => {
    document.title = "ParkEase - Home";
  }, []);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        setLoading(true);
        setError(null);

        const activeCenter = userLocation || searchCenter || PUNE_CENTER;
        const response = await fetch(`${API_URL}/api/parking?lat=${activeCenter.lat}&lng=${activeCenter.lng}`);
        const result = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(result.message || "Unable to load parking locations.");
        }

        setLocations(Array.isArray(result.data) ? result.data : []);
      } catch (err) {
        console.error("Home fetch error:", err);
        setError(err.message || "Parking locations could not be loaded.");
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, [userLocation, searchCenter]);

  const filteredLocations = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return locations
      .filter((location) => {
        const categoryName = getLocationCategory(location);
        if (category !== "All" && categoryName !== category) return false;
        return [location.name, location.landmark, location.address]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(query);
      })
      .slice(0, 24);
  }, [locations, category, searchQuery]);

  const handleUseGps = () => {
    if (!navigator.geolocation) {
      setStatusMessage("GPS is not available in this browser.");
      return;
    }

    setStatusMessage("Requesting your location...");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: Number(position.coords.latitude.toFixed(6)),
          lng: Number(position.coords.longitude.toFixed(6)),
        });
        setSearchCenter(null);
        setStatusMessage("Showing parking near your live location.");
      },
      () => {
        setStatusMessage("Location permission denied. Showing popular Pune parking.");
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  return (
    <main className="page">
      <section className="hero">
        <div className="hero-content">
          <div>
            <span className="hero-kicker">Premium parking</span>
            <h1 className="hero-title">Reserve parking in seconds</h1>
            <p className="hero-text">
              Discover curated parking spots across Pune with live availability, fast booking, and a polished app experience.
            </p>
          </div>

          <div className="hero-actions">
            <div className="search-bar">
              <input
                type="search"
                placeholder="Search by area, landmark or address..."
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
              />
            </div>

            <div className="category-tabs">
              {CATEGORIES.map((item) => (
                <button
                  key={item}
                  type="button"
                  className={`category-tab ${category === item ? "active" : ""}`}
                  onClick={() => setCategory(item)}
                >
                  {item}
                </button>
              ))}
            </div>

            <div className="stats-row">
              <div className="stats-item">🅿️ 500+ Parking Spots</div>
              <div className="stats-item">⚡ 30 sec Booking</div>
              <div className="stats-item">🏙️ 10+ Cities</div>
            </div>
          </div>
        </div>
      </section>

      <div className="section-header">
        <div>
          <h2 className="section-title">Available locations</h2>
          <p className="section-subtitle">{statusMessage}</p>
        </div>
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <button className="btn btn-secondary" onClick={handleUseGps}>
            Use my location
          </button>
          <button
            className="btn btn-outline"
            onClick={() => {
              setSearchCenter(PUNE_CENTER);
              setUserLocation(null);
              setSearchQuery("");
              setCategory("All");
              setStatusMessage("Showing popular Pune parking.");
            }}
          >
            Reset area
          </button>
        </div>
      </div>

      {error && <p className="status error">{error}</p>}

      {loading ? (
        <div className="skeleton-grid">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="skeleton-card" />
          ))}
        </div>
      ) : filteredLocations.length > 0 ? (
        <div className="locations-grid">
          {filteredLocations.map((location) => (
            <ParkingCard
              key={location.id}
              locationId={location.id}
              name={location.name}
              address={location.address}
              totalSlots={location.totalSlots}
              availableSlots={location.availableSlots}
              pricePerHour={location.pricePerHour}
              distanceKm={location.distanceKm}
              type={location.type}
              landmark={location.landmark}
            />
          ))}
        </div>
      ) : (
        <section className="panel empty-state">
          <div>
            <span className="empty-state-icon">🔍</span>
            <h2>No spots match your search</h2>
            <p className="section-subtitle">Try another keyword or reset the area to browse more parking.</p>
          </div>
        </section>
      )}
    </main>
  );
}

export default Home;
