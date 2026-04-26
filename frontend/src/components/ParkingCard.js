import React from "react";
import { useNavigate } from "react-router-dom";

function ParkingCard({
  name,
  address,
  totalSlots,
  availableSlots,
  pricePerHour,
  locationId,
  distanceKm,
  type,
  landmark,
  isSelected,
}) {
  const navigate = useNavigate();
  const slots = Number(totalSlots) || 0;
  const available = Number(availableSlots) || Math.max(Math.round(slots * 0.55), 0);
  const freePercent = slots ? Math.max(0, Math.min(100, Math.round((available / slots) * 100))) : 0;
  const isFree = type === "free" || Number(pricePerHour) === 0;
  const rating = Number(
    Math.min(4.9, 4.2 + Math.max(0, Math.min(0.7, (freePercent / 100) * 0.65))).toFixed(1)
  );

  return (
    <article
      className={`parking-card${isSelected ? " selected" : ""}`}
      onClick={() => navigate(`/slots/${locationId}`)}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => event.key === "Enter" && navigate(`/slots/${locationId}`)}
    >
      <div className="card-header">
        <span className="badge-row">
          <span className={`badge ${isFree ? "badge-free" : "badge-paid"}`}>{isFree ? "Free" : "Paid"}</span>
          {distanceKm != null && <span className="distance-badge">{distanceKm} km</span>}
        </span>
        <div className="rating-pill">{rating}★</div>
      </div>

      <h3>{landmark || name}</h3>
      {landmark && <p className="parking-subtitle">{name}</p>}

      <div className="availability">
        <div className="availability-label">
          <span>{available} / {slots} slots free</span>
          <strong>{freePercent}%</strong>
        </div>
        <div className="availability-track">
          <div className="availability-fill" style={{ width: `${freePercent}%` }} />
        </div>
      </div>

      <div className="parking-card-footer">
        <div>
          <div className="parking-price">{isFree ? "Free" : `₹${pricePerHour}/hr`}</div>
          <p>{address}</p>
        </div>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={(event) => {
            event.stopPropagation();
            window.open(
              `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`,
              "_blank"
            );
          }}
        >
          📍 Directions
        </button>
      </div>
    </article>
  );
}

export default ParkingCard;
