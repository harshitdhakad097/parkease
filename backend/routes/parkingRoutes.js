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
    // Reference to "parkingLocations" collection
    const snapshot = await db.collection("parkingLocations").get();

    // Convert documents into array
    const parkingLocations = snapshot.docs.map((doc) => ({
      id: doc.id, // Document ID
      ...doc.data(), // Document fields
    }));

    // Send success response
    res.status(200).json({
      success: true,
      data: parkingLocations,
    });
  } catch (error) {
    console.error("Error fetching parking locations:", error);

    // Send error response
    res.status(500).json({
      success: false,
      message: "Failed to fetch parking locations",
    });
  }
});

// Export router
module.exports = router;