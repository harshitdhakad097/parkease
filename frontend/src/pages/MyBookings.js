import React, { useEffect, useMemo, useState } from "react";

const API_URL = process.env.REACT_APP_API_URL || "";
const TABS = [
  { id: "upcoming", label: "Upcoming" },
  { id: "past", label: "Past" },
  { id: "cancelled", label: "Cancelled" },
];

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("upcoming");
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    document.title = "ParkEase - My Bookings";
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_URL}/api/bookings`);
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.message || "Unable to load bookings.");
      setBookings(Array.isArray(result.data) ? result.data : []);
    } catch (err) {
      console.error("MyBookings fetch error:", err);
      setError(err.message || "Unable to load your bookings.");
    } finally {
      setLoading(false);
    }
  };

  const cancelBooking = async (id) => {
    setCancellingId(id);
    try {
      const response = await fetch(`${API_URL}/api/bookings/${id}`, {
        method: "DELETE",
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.message || "Unable to cancel booking.");
      setBookings((prev) => prev.map((booking) => (booking.id === id ? { ...booking, status: "cancelled" } : booking)));
    } catch (err) {
      console.error("Cancel booking error:", err);
      setError(err.message || "Could not cancel booking.");
    } finally {
      setCancellingId(null);
    }
  };

  const bookingsByTab = useMemo(() => {
    const now = new Date();
    return bookings.filter((booking) => {
      if (activeTab === "cancelled") return booking.status === "cancelled";
      if (activeTab === "upcoming") {
        return booking.status !== "cancelled" && new Date(`${booking.bookingDate}`) >= now;
      }
      return booking.status !== "cancelled" && new Date(`${booking.bookingDate}`) < now;
    });
  }, [activeTab, bookings]);

  const formatBookingDate = (dateValue) => {
    try {
      return new Date(dateValue).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
    } catch {
      return dateValue;
    }
  };

  return (
    <main className="page">
      <section className="section-header">
        <div>
          <span className="hero-kicker">Reservations</span>
          <h2>My bookings</h2>
          <p className="section-subtitle">View, refresh, and manage your parking reservations.</p>
        </div>
        <button className="btn btn-secondary" type="button" onClick={fetchBookings}>
          Refresh
        </button>
      </section>

      <div className="booking-tabs">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`booking-tab ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {error && <p className="status error">{error}</p>}

      {loading ? (
        <div className="skeleton-grid">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="skeleton-card" />
          ))}
        </div>
      ) : bookingsByTab.length > 0 ? (
        <div className="bookings-grid">
          {bookingsByTab.map((booking) => {
            const isCancelled = booking.status === "cancelled";
            const isPast = !isCancelled && new Date(booking.bookingDate) < new Date();
            const statusLabel = isCancelled ? "Cancelled" : isPast ? "Past" : "Upcoming";
            return (
              <article key={booking.id} className="booking-card">
                <div className="booking-card-header">
                  <div>
                    <h3>{booking.locationName}</h3>
                    <p className="booking-subtitle">{booking.address}</p>
                  </div>
                  <span className={`booking-chip ${statusLabel.toLowerCase()}`}>{statusLabel}</span>
                </div>

                <div className="booking-grid">
                  <div>
                    <span>Slot</span>
                    <strong>{booking.slotNumber}</strong>
                  </div>
                  <div>
                    <span>Date</span>
                    <strong>{formatBookingDate(booking.bookingDate)}</strong>
                  </div>
                  <div>
                    <span>Duration</span>
                    <strong>{booking.durationHours || booking.duration || 1} hr</strong>
                  </div>
                  <div>
                    <span>Amount</span>
                    <strong>₹{booking.pricePerHour || booking.total}</strong>
                  </div>
                </div>

                <div className="booking-actions">
                  {!isCancelled && !isPast && (
                    <button
                      className="btn btn-outline"
                      type="button"
                      onClick={() => cancelBooking(booking.id)}
                      disabled={cancellingId === booking.id}
                    >
                      {cancellingId === booking.id ? "Cancelling..." : "Cancel booking"}
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <section className="panel empty-state">
          <div>
            <span className="empty-state-icon">🗂️</span>
            <h2>No bookings found</h2>
            <p className="section-subtitle">Switch tabs or create a new booking from the home page.</p>
          </div>
        </section>
      )}
    </main>
  );
}

export default MyBookings;
