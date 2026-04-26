import React from "react";

function SlotGrid({ slots, selectedSlot, onSlotSelect }) {
  return (
    <div>
      <div className="slot-grid">
        {slots.map((slot) => (
          <button
            key={slot.slotNumber}
            className={`slot-button${slot.isBooked ? " booked" : ""}${
              selectedSlot === slot.slotNumber ? " selected" : ""
            }`}
            disabled={slot.isBooked}
            onClick={() => onSlotSelect(slot.slotNumber)}
            title={slot.isBooked ? `${slot.slotNumber} is booked` : `Select ${slot.slotNumber}`}
          >
            {slot.slotNumber}
          </button>
        ))}
      </div>

      <div className="legend" aria-label="Slot status legend">
        <span className="legend-item">
          <span className="legend-dot" style={{ background: "#10B981" }} />
          Available
        </span>
        <span className="legend-item">
          <span className="legend-dot" style={{ background: "#EF4444" }} />
          Booked
        </span>
        <span className="legend-item">
          <span className="legend-dot" style={{ background: "#3B82F6" }} />
          Selected
        </span>
      </div>
    </div>
  );
}

export default SlotGrid;
