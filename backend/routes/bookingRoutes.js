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

// GET /api/bookings
// Fetch all bookings from Firestore
router.get("/bookings", async (req, res) => {
  try {
    console.log("Fetching all bookings...");

    // Reference to "bookings" collection
    const snapshot = await db.collection("bookings").get();

    // Check if collection is empty
    if (snapshot.empty) {
      console.warn("No bookings found in Firestore");
      return res.status(200).json({
        success: true,
        message: "No bookings available",
        data: [],
      });
    }

    // Convert documents into array
    const bookings = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    console.log(`Successfully fetched ${bookings.length} bookings`);

    // Send success response
    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    console.error("Error fetching bookings:", {
      message: error.message,
      code: error.code,
      stack: error.stack,
    });

    // Send error response with detailed info in development
    res.status(500).json({
      success: false,
      message: "Failed to fetch bookings",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// POST /api/bookings
// Create a new booking
router.post("/bookings", async (req, res) => {
  try {
    // Extract data from request body
    const { locationId, slotNumber, locationName, pricePerHour } = req.body;

    // Basic validation - check all required fields exist
    if (!locationId || !slotNumber || !locationName || !pricePerHour) {
      console.warn("Missing required fields in booking request:", { locationId, slotNumber, locationName, pricePerHour });
      return res.status(400).json({
        success: false,
        message: "Missing required fields: locationId, slotNumber, locationName, pricePerHour",
      });
    }

    // Validate data types
    if (typeof locationId !== "string" || locationId.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid locationId: must be a non-empty string",
      });
    }

    if (typeof slotNumber !== "string" || slotNumber.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid slotNumber: must be a non-empty string",
      });
    }

    if (typeof locationName !== "string" || locationName.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid locationName: must be a non-empty string",
      });
    }

    if (typeof pricePerHour !== "number" || pricePerHour <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid pricePerHour: must be a positive number",
      });
    }

    // Generate QR code string
    const qrCode = generateQRCode();

    // Create booking object
    const newBooking = {
      locationId: locationId.trim(),
      slotNumber: slotNumber.trim(),
      locationName: locationName.trim(),
      pricePerHour: pricePerHour,
      status: "confirmed",
      qrCode,
      createdAt: new Date(), // Timestamp
    };

    // Save to Firestore
    const docRef = await db.collection("bookings").add(newBooking);

    console.log("Booking created successfully:", { id: docRef.id, ...newBooking });

    // Return success response with booking ID and QR code
    res.status(201).json({
      success: true,
      id: docRef.id,
      qrCode: qrCode,
      data: newBooking,
    });
  } catch (error) {
    console.error("Error creating booking:", {
      message: error.message,
      code: error.code,
      stack: error.stack,
      requestBody: req.body,
    });

    // Error response with detailed info in development
    res.status(500).json({
      success: false,
      message: "Failed to create booking",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// Export router
module.exports = router;