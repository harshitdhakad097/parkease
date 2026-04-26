import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL || "";

const isBookedBySeed = (locationId, slotIndex) => {
  const seed = parseInt(locationId, 10) || 0;
  return (seed + slotIndex) % 5 === 0;
};

function SlotSelection() {
  const { locationId } = useParams();
  const navigate = useNavigate();
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [activeFloor, setActiveFloor] = useState("A");
  const [duration, setDuration] = useState(1);

  useEffect(() => {
    document.title = "ParkEase - Select Slot";
  }, []);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`${API_URL}/api/parking/${locationId}`);
        const result = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(result.message || "Parking details unavailable.");
        setLocation(result.data);
      } catch (err) {
        console.error("Slot selection fetch error:", err);
        setError(err.message || "Unable to load parking details.");
      } finally {
        setLoading(false);
      }
    };

    if (locationId) {
      fetchLocation();
    }
  }, [locationId]);

  const floors = useMemo(() => {
    if (!location) return ["A"];
    if (Array.isArray(location.floors) && location.floors.length > 0) {
      return location.floors;
    }
    const count = Math.max(1, Math.min(3, Math.ceil((Number(location.totalSlots) || 18) / 16)));
    return Array.from({ length: count }, (_, index) => String.fromCharCode(65 + index));
  }, [location]);

  const pricePerHour = useMemo(
    () => (location?.pricePerHour != null ? Number(location.pricePerHour) : 30),
    [location]
  );

  const slots = useMemo(() => {
    if (!location) return [];
    const totalSlots = Math.max(12, Number(location.totalSlots) || 18);
    const perFloor = Math.ceil(totalSlots / floors.length);

    return floors.flatMap((floor, floorIndex) =>
      Array.from({ length: perFloor }, (_, index) => {
        const slotIndex = floorIndex * perFloor + index;
        const slotNumber = `${floor}${index + 1}`;
        return {
          slotNumber,
          floor,
          booked: isBookedBySeed(locationId, slotIndex),
          price: pricePerHour,
        };
      })
    );
  }, [floors, location, locationId, pricePerHour]);

  const currentSlots = useMemo(
    () => slots.filter((slot) => slot.floor === activeFloor),
    [activeFloor, slots]
  );

  useEffect(() => {
    if (selectedSlot && !currentSlots.some((slot) => slot.slotNumber === selectedSlot)) {
      setSelectedSlot(null);
    }
  }, [currentSlots, selectedSlot]);

  const availableCount = currentSlots.filter((slot) => !slot.booked).length;

  const handleContinue = () => {
    if (!selectedSlot) return;
    const booking = {
      id: `${locationId}-${selectedSlot}`,
      locationId,
      locationName: location.name,
      address: location.address,
      slotNumber: selectedSlot,
      pricePerHour,
      durationHours: duration,
      duration,
      total: pricePerHour * duration,
      status: "upcoming",
      bookingDate: new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
      startTime: "10:00 AM",
    };

    localStorage.setItem("parkingBooking", JSON.stringify(booking));
    navigate("/payment");
  };

  if (loading) {
    return (
      <main className="page">
        <section className="section-header">
          <h2>Loading parking layout</h2>
          <p className="section-subtitle">Preparing your slot selection experience...</p>
        </section>
        <div className="skeleton-grid">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="skeleton-card" />
          ))}
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="page">
        <section className="section-header">
          <h2>Parking not available</h2>
          <p className="section-subtitle">{error}</p>
          <button className="btn btn-secondary" onClick={() => navigate(-1)}>
            Back to listings
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="page">
      <section className="section-header">
        <div>
          <span className="hero-kicker">Parking layout</span>
          <h2>{location.name}</h2>
          <p className="section-subtitle">{location.address}</p>
        </div>
        <button className="btn btn-outline" onClick={() => navigate(-1)}>
          Back to search
        </button>
      </section>

      <div className="slot-page-grid">
        <section className="panel card-panel">
          <div className="slot-panel-header">
            <div>
              <h3>Select a slot</h3>
              <p className="section-subtitle">{availableCount} spots open on floor {activeFloor}</p>
            </div>
            <div className="parking-flags">
              <span>{location.availableSlots} available</span>
              <span>{location.totalSlots} total</span>
            </div>
          </div>

          <div className="parking-floor-tabs">
            {floors.map((floor) => (
              <button
                type="button"
                key={floor}
                className={`parking-floor-tab ${activeFloor === floor ? "active" : ""}`}
                onClick={() => setActiveFloor(floor)}
              >
                Floor {floor}
              </button>
            ))}
          </div>

          <div className="parking-lot">
            <div className="parking-row">
              {currentSlots.filter((_, index) => index % 2 === 0).map((slot) => (
                <button
                  type="button"
                  key={slot.slotNumber}
                  className={`parking-slot ${slot.booked ? "booked" : "available"} ${selectedSlot === slot.slotNumber ? "selected" : ""}`}
                  onClick={() => !slot.booked && setSelectedSlot(slot.slotNumber)}
                  disabled={slot.booked}
                >
                  <span>{slot.slotNumber}</span>
                  <small>{slot.booked ? "Blocked" : "Available"}</small>
                </button>
              ))}
            </div>
            <div className="parking-lane">Drive lane</div>
            <div className="parking-row">
              {currentSlots.filter((_, index) => index % 2 !== 0).map((slot) => (
                <button
                  type="button"
                  key={slot.slotNumber}
                  className={`parking-slot ${slot.booked ? "booked" : "available"} ${selectedSlot === slot.slotNumber ? "selected" : ""}`}
                  onClick={() => !slot.booked && setSelectedSlot(slot.slotNumber)}
                  disabled={slot.booked}
                >
                  <span>{slot.slotNumber}</span>
                  <small>{slot.booked ? "Blocked" : "Available"}</small>
                </button>
              ))}
            </div>
          </div>
        </section>

        <aside className="panel card-panel booking-summary">
          <div className="summary-pill">Premium ticket</div>
          <h3>Confirm your stay</h3>
          <p className="section-subtitle">Choose your slot and continue to payment.</p>

          <div className="booking-detail">
            <span>Selected slot</span>
            <strong>{selectedSlot || "None selected"}</strong>
          </div>
          <div className="booking-detail">
            <span>Duration</span>
            <strong>{duration} hour{duration > 1 ? "s" : ""}</strong>
          </div>
          <div className="booking-detail">
            <span>Rate per hour</span>
            <strong>₹{pricePerHour}</strong>
          </div>
          <div className="booking-detail booking-total">
            <span>Total estimate</span>
            <strong>₹{pricePerHour * duration}</strong>
          </div>

          <label className="field-label">
            Reservation hours
            <input
              type="range"
              min="1"
              max="6"
              value={duration}
              onChange={(event) => setDuration(Number(event.target.value))}
            />
          </label>

          <button className="btn btn-full" onClick={handleContinue} disabled={!selectedSlot}>
            Continue to payment
          </button>
        </aside>
      </div>

      <div className="sticky-summary">
        <div>
          <span>{selectedSlot ? `Selected ${selectedSlot}` : "Pick a slot to continue"}</span>
          <strong>₹{pricePerHour * duration}</strong>
        </div>
        <button className="btn btn-full" onClick={handleContinue} disabled={!selectedSlot}>
          Pay now
        </button>
      </div>
    </main>
  );
}

export default SlotSelection;
