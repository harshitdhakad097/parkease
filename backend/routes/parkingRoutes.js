// Import Express
const express = require("express");

// Create a router instance
const router = express.Router();

// Import Firestore admin database
const db = require("../firebase-admin");
const puneParking = require("../data/puneParking");

const PUNE_CENTER = { lat: 18.5204, lng: 73.8567 };
const DEFAULT_RADIUS_KM = 35;

const toNumber = (value) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
};

const findDestination = (query) => {
  const normalizedQuery = String(query || "").trim().toLowerCase();
  if (!normalizedQuery) return null;

  return puneParking.find((location) =>
    [location.name, location.landmark, location.address]
      .filter(Boolean)
      .some((value) => value.toLowerCase().includes(normalizedQuery))
  );
};

const distanceInKm = (fromLat, fromLng, toLat, toLng) => {
  if ([fromLat, fromLng, toLat, toLng].some((value) => typeof value !== "number")) {
    return null;
  }

  const earthRadiusKm = 6371;
  const toRad = (degree) => (degree * Math.PI) / 180;
  const dLat = toRad(toLat - fromLat);
  const dLng = toRad(toLng - fromLng);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(fromLat)) *
      Math.cos(toRad(toLat)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  return earthRadiusKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

const normalizeParking = (location) => ({
  ...location,
  availableSlots:
    typeof location.availableSlots === "number"
      ? location.availableSlots
      : Math.max(Math.round((Number(location.totalSlots) || 0) * 0.55), 0),
  pricePerHour: Number(location.pricePerHour) || 0,
  type: location.type || (Number(location.pricePerHour) > 0 ? "paid" : "free"),
});

const mergeParkingLocations = (firestoreLocations) => {
  const byId = new Map();

  [...firestoreLocations, ...puneParking].forEach((location) => {
    const normalized = normalizeParking(location);
    byId.set(normalized.id, normalized);
  });

  return Array.from(byId.values());
};

// GET /api/parking
// Fetch all parking locations from Firestore
router.get("/parking", async (req, res) => {
  try {
    // Log incoming request (optional, for debugging)
    console.log("Fetching all parking locations...");

    // Reference to "parkingLocations" collection
    const snapshot = await db.collection("parkingLocations").get();

    // Convert documents into array
    const firestoreLocations = snapshot.docs.map((doc) => ({
      id: doc.id, // Document ID
      ...doc.data(), // Document fields
    }));
    const matchedDestination = findDestination(req.query.q);
    const userLat = toNumber(req.query.lat) ?? matchedDestination?.lat ?? PUNE_CENTER.lat;
    const userLng = toNumber(req.query.lng) ?? matchedDestination?.lng ?? PUNE_CENTER.lng;
    const withDistance = mergeParkingLocations(firestoreLocations)
      .map((location) => {
        const distanceKm = distanceInKm(userLat, userLng, location.lat, location.lng);
        return distanceKm == null
          ? location
          : { ...location, distanceKm: Number(distanceKm.toFixed(2)) };
      })
      .sort((a, b) => {
        if (a.distanceKm == null && b.distanceKm == null) return a.name.localeCompare(b.name);
        if (a.distanceKm == null) return 1;
        if (b.distanceKm == null) return -1;
        return a.distanceKm - b.distanceKm;
      });
    const nearbyLocations = withDistance.filter(
      (location) => location.distanceKm == null || location.distanceKm <= DEFAULT_RADIUS_KM
    );
    const parkingLocations = nearbyLocations.length > 0 ? nearbyLocations : withDistance.slice(0, 10);

    console.log(`Successfully fetched ${parkingLocations.length} parking locations`);

    // Send success response
    res.status(200).json({
      success: true,
      count: parkingLocations.length,
      center: { lat: userLat, lng: userLng },
      matchedDestination: matchedDestination || null,
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

// GET /api/parking/:id
// Fetch a single parking location by ID from Firestore
router.get("/parking/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const docRef = await db.collection("parkingLocations").doc(id).get();
    const puneLocation = puneParking.find((location) => location.id === id);

    if (!docRef.exists && !puneLocation) {
      return res.status(404).json({
        success: false,
        message: "Parking location not found",
      });
    }

    const location = docRef.exists ? { id: docRef.id, ...docRef.data() } : puneLocation;

    res.status(200).json({
      success: true,
      data: normalizeParking(location),
    });
  } catch (error) {
    console.error("Error fetching parking location by id:", {
      message: error.message,
      code: error.code,
      stack: error.stack,
    });

    res.status(500).json({
      success: false,
      message: "Failed to fetch parking location",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

module.exports = router;
