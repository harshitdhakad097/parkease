import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
  useLocation,
} from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import SlotSelection from "./pages/SlotSelection";
import BookingConfirm from "./pages/BookingConfirm";
import QRCodePage from "./pages/QRCodePage";
import MyBookings from "./pages/MyBookings";

function AnimatedRoutes() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);

  return (
    <div className="page-transition">
      <Routes location={location}>
        <Route path="/" element={<Home />} />
        <Route path="/slots/:locationId" element={<SlotSelection />} />
        <Route path="/confirm" element={<BookingConfirm />} />
        <Route path="/payment" element={<BookingConfirm />} />
        <Route path="/qrcode" element={<QRCodePage />} />
        <Route path="/my-bookings" element={<MyBookings />} />
      </Routes>
    </div>
  );
}

function App() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const handleToast = (event) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      const toast = {
        id,
        message: event.detail.message,
        type: event.detail.type || "default",
      };
      setToasts((prev) => [...prev, toast]);
      window.setTimeout(() => {
        setToasts((prev) => prev.filter((item) => item.id !== id));
      }, 4200);
    };

    window.addEventListener("parkease-toast", handleToast);
    return () => window.removeEventListener("parkease-toast", handleToast);
  }, []);

  return (
    <Router>
      <div className="app-shell">
        <Navbar />
        <AnimatedRoutes />

        <nav className="mobile-bottom-nav">
          <NavLink to="/" className={({ isActive }) => (isActive ? "bottom-link active" : "bottom-link")}>
            🏠 Home
          </NavLink>
          <NavLink
            to="/payment"
            className={({ isActive }) => (isActive ? "bottom-link active" : "bottom-link")}
          >
            🅿️ Book
          </NavLink>
          <NavLink
            to="/my-bookings"
            className={({ isActive }) => (isActive ? "bottom-link active" : "bottom-link")}
          >
            📋 Bookings
          </NavLink>
        </nav>

        <div className="toast-container">
          {toasts.map((toast) => (
            <div key={toast.id} className={`toast ${toast.type}`}>
              {toast.message}
            </div>
          ))}
        </div>
      </div>
    </Router>
  );
}

export default App;
