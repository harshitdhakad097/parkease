// Import React
import React from "react";

// Import React Router components
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // Used for routing

// Import Navbar component (shown on all pages)
import Navbar from "./components/Navbar";

// Import all pages from pages folder
import Home from "./pages/Home"; // Home page ("/")
import SlotSelection from "./pages/SlotSelection"; // Slot selection page ("/slots/:locationId")
import BookingConfirm from "./pages/BookingConfirm"; // Booking confirmation page ("/confirm")
import QRCodePage from "./pages/QRCodePage"; // QR code display page ("/qrcode")
import MyBookings from "./pages/MyBookings"; // User bookings page ("/my-bookings")

// Main App component
function App() {
  return (
    // Wrap entire app with Router
    <Router>
      {/* Navbar will be visible on all pages */}
      <Navbar />

      {/* Define all routes */}
      <Routes>
        {/* Home page route */}
        <Route path="/" element={<Home />} />

        {/* Slot selection page with dynamic locationId */}
        <Route path="/slots/:locationId" element={<SlotSelection />} />

        {/* Booking confirmation page */}
        <Route path="/confirm" element={<BookingConfirm />} />

        {/* QR code page */}
        <Route path="/qrcode" element={<QRCodePage />} />

        {/* My bookings page */}
        <Route path="/my-bookings" element={<MyBookings />} />
      </Routes>
    </Router>
  );
}

// Export App component
export default App;
