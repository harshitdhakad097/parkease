// Import Firebase Admin SDK
const admin = require("firebase-admin");

// Load service account key JSON file from backend folder
const serviceAccount = require("./backend/serviceAccountKey.json");

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Get Firestore database reference
const db = admin.firestore();

// Sample parking locations with real Indian city coordinates
const parkingLocations = [
  {
    name: "Bandra Central Parking",
    address: "Bandra, Mumbai, India",
    totalSlots: 20,
    pricePerHour: 50, // Indian Rupees
    lat: 19.0596,
    lng: 72.8295,
  },
  {
    name: "Marine Drive Parking Hub",
    address: "Marine Drive, Mumbai, India",
    totalSlots: 20,
    pricePerHour: 75,
    lat: 18.9676,
    lng: 72.8260,
  },
  {
    name: "MG Road Parking Plaza",
    address: "MG Road, Pune, India",
    totalSlots: 20,
    pricePerHour: 40,
    lat: 18.5204,
    lng: 73.8567,
  },
];

// Function to seed Firestore database
async function seedDatabase() {
  try {
    console.log("Starting seeding...");

    // Add each parking location to Firestore
    for (const location of parkingLocations) {
      // Add document with auto-generated ID
      const docRef = await db
        .collection("parkingLocations")
        .add(location);

      console.log(`Added: ${location.name} (ID: ${docRef.id})`);
    }

    console.log("Seeding complete");

    // Exit the process
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

// Run the seed function
seedDatabase();
