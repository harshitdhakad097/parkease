// Import Express
const express = require("express");

// Create a router instance
const router = express.Router();

// Import Firestore admin database
const db = require("../firebase-admin");

// GET /api/parking
// Fetch all parking locations from Firestore
router.get("/parking", async (req, res) => {
  try {
    // Log incoming request (optional, for debugging)
    console.log("Fetching all parking locations...");

    // Reference to "parkingLocations" collection
    const snapshot = await db.collection("parkingLocations").get();

    // Check if collection is empty
    if (snapshot.empty) {
      console.warn("No parking locations found in Firestore");
      return res.status(200).json({
        success: true,
        message: "No parking locations available",
        data: [],
      });
    }

    // Convert documents into array
    const parkingLocations = snapshot.docs.map((doc) => ({
      id: doc.id, // Document ID
      ...doc.data(), // Document fields
    }));

    console.log(`Successfully fetched ${parkingLocations.length} parking locations`);

    // Send success response
    res.status(200).json({
      success: true,
      count: parkingLocations.length,
      data: parkingLocations,
    });
  } catch (error) {
    console.error("Error fetching parking locations:", {
      message: error.message,
      code: error.code,
      stack: error.stack,
    });

    // Send error response with detailed info in development
    res.status(500).json({
      success: false,
      message: "Failed to fetch parking locations",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// Export router
module.exports = router;