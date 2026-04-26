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
    const {
      locationId,
      slotNumber,
      locationName,
      pricePerHour,
      bookingDate,
      startTime,
      durationHours,
      startsAt,
      endsAt,
    } = req.body;

    // Basic validation - check all required fields exist
    if (
      !locationId ||
      !slotNumber ||
      !locationName ||
      pricePerHour == null ||
      !bookingDate ||
      !startTime ||
      durationHours == null
    ) {
      console.warn("Missing required fields in booking request:", {
        locationId,
        slotNumber,
        locationName,
        pricePerHour,
        bookingDate,
        startTime,
        durationHours,
      });
      return res.status(400).json({
        success: false,
        message:
          "Missing required fields: locationId, slotNumber, locationName, pricePerHour, bookingDate, startTime, durationHours",
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

    if (typeof pricePerHour !== "number" || pricePerHour < 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid pricePerHour: must be zero or a positive number",
      });
    }

    if (typeof bookingDate !== "string" || typeof startTime !== "string") {
      return res.status(400).json({
        success: false,
        message: "Invalid booking date or start time",
      });
    }

    if (typeof durationHours !== "number" || durationHours < 1 || durationHours > 12) {
      return res.status(400).json({
        success: false,
        message: "Invalid durationHours: must be between 1 and 12",
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
      bookingDate,
      startTime,
      durationHours,
      startsAt,
      endsAt,
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

// DELETE /api/bookings/:id
// Cancel a booking by document ID
router.delete("/bookings/:id", async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      success: false,
      message: "Booking id is required to cancel a booking.",
    });
  }

  try {
    const bookingRef = db.collection("bookings").doc(id);
    const bookingDoc = await bookingRef.get();

    if (!bookingDoc.exists) {
      return res.status(404).json({
        success: false,
        message: "Booking not found.",
      });
    }

    await bookingRef.update({ status: "cancelled", cancelledAt: new Date() });

    res.status(200).json({
      success: true,
      message: "Booking cancelled successfully.",
      id,
    });
  } catch (error) {
    console.error("Error cancelling booking:", {
      message: error.message,
      code: error.code,
      stack: error.stack,
      bookingId: id,
    });
    res.status(500).json({
      success: false,
      message: "Failed to cancel booking",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// Export router
module.exports = router;
