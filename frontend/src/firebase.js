// Import required Firebase functions
import { initializeApp } from "firebase/app"; // Initializes Firebase app
import { getFirestore } from "firebase/firestore"; // Firestore database service
import { getAuth } from "firebase/auth"; // Firebase authentication service

// Firebase configuration using environment variables from .env
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY, // API key for your Firebase project
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN, // Auth domain (used for login)
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID, // Project ID
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET, // Storage bucket
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID, // Messaging sender ID
  appId: process.env.REACT_APP_FIREBASE_APP_ID, // App ID
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Firestore database
const db = getFirestore(app);

// Initialize Firebase Authentication
const auth = getAuth(app);

// Export Firestore instance
export { db };

// Export Auth instance
export { auth };