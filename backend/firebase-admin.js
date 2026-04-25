// Import Firebase Admin SDK
const admin = require("firebase-admin");

// Load service account key JSON file
// Make sure this file exists in your backend folder
const serviceAccount = require("./serviceAccountKey.json");

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount), // Use service account credentials
});

// Initialize Firestore database (admin access)
const db = admin.firestore();

// Export Firestore instance so it can be used in routes
module.exports = db;