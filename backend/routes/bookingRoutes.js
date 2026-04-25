// Import Express
const express = require("express");

// Create router instance
const router = express.Router();

// Import Firestore admin database
const db = require("../firebase-admin");

// Helper function to generate random QR code string
const generateQRCode = () => {
  return "QR_" + Math.random().toString(36).substring(2, 10);
};

// POST /api/bookings
// Create a new booking
router.post("/bookings", async (req, res) => {
  try {
    // Extract data from request body
    const { locationId, slotNumber, locationName, pricePerHour } = req.body;

    // Basic validation
    if (!locationId || !slotNumber || !locationName || !pricePerHour) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    // Generate QR code string
    const qrCode = generateQRCode();

    // Create booking object
    const newBooking = {
      locationId,
      slotNumber,
      locationName,
      pricePerHour,
      status: "confirmed",
      qrCode,
      createdAt: new Date(), // Timestamp
    };

    // Save to Firestore
    const docRef = await db.collection("bookings").add(newBooking);

    // Return success response with booking ID
    res.status(201).json({
      success: true,
      id: docRef.id,
      data: newBooking,
    });
  } catch (error) {
    console.error("Error creating booking:", error);

    // Error response
    res.status(500).json({
      success: false,
      message: "Failed to create booking",
    });
  }
});

// Export router
module.exports = router;