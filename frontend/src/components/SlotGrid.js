// Import React
import React from "react";

// SlotGrid component receives slots array and onSlotSelect function
function SlotGrid({ slots, onSlotSelect }) {
  return (
    <div>
      {/* Legend section */}
      <div style={styles.legend}>
        <div style={styles.legendItem}>
          <div style={{ ...styles.box, backgroundColor: "green" }}></div>
          <span>Available</span>
        </div>
        <div style={styles.legendItem}>
          <div style={{ ...styles.box, backgroundColor: "red" }}></div>
          <span>Booked</span>
        </div>
      </div>

      {/* Grid container */}
      <div style={styles.grid}>
        {slots.map((slot) => (
          <div
            key={slot.slotNumber} // Unique key for each slot
            style={{
              ...styles.box,
              backgroundColor: slot.isBooked ? "red" : "green", // Color based on status
              cursor: slot.isBooked ? "not-allowed" : "pointer", // Disable click if booked
            }}
            onClick={() => {
              // Only allow click if slot is available
              if (!slot.isBooked) {
                onSlotSelect(slot.slotNumber);
              }
            }}
          >
            {/* Show slot number */}
            {slot.slotNumber}
          </div>
        ))}
      </div>
    </div>
  );
}

// Inline styles
const styles = {
  grid: {
    display: "grid", // Grid layout
    gridTemplateColumns: "repeat(5, 1fr)", // 5 columns
    gap: "10px", // Space between boxes
    marginTop: "20px",
  },
  box: {
    height: "50px",
    borderRadius: "5px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "#fff",
    fontWeight: "bold",
  },
  legend: {
    display: "flex",
    gap: "20px",
    alignItems: "center",
  },
  legendItem: {
    display: "flex",
    alignItems: "center",
    gap: "5px",
  },
};

// Export component
export default SlotGrid;