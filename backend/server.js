// Import required packages
const express = require("express"); // Express framework
const cors = require("cors"); // Enable cross-origin requests
require("dotenv").config(); // Load environment variables from .env

// Import route files
const parkingRoutes = require("./routes/parkingRoutes"); // Parking routes
const bookingRoutes = require("./routes/bookingRoutes"); // Booking routes

// Create Express app
const app = express();

// Middleware setup
app.use(cors()); // Allow requests from frontend (React)
app.use(express.json()); // Parse JSON request body

// Use routes
app.use("/api", parkingRoutes); // Routes for parking
app.use("/api", bookingRoutes); // Routes for bookings

// Set PORT from .env or default to 5000
const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});