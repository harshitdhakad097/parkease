import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL || "";

function BookingConfirm() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [activeStep, setActiveStep] = useState(2);
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [upiOption, setUpiOption] = useState("GPay");
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("ParkEase User");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [bank, setBank] = useState("SBI");
  const [walletOption, setWalletOption] = useState("Paytm");

  const bookingData = useMemo(() => {
    try {
      const raw = localStorage.getItem("parkingBooking") || localStorage.getItem("booking");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }, []);

  useEffect(() => {
    document.title = "ParkEase - Payment";
  }, []);

  useEffect(() => {
    if (!processing) return undefined;
    const interval = window.setInterval(() => {
      setProgress((current) => {
        const next = Math.min(100, current + 12);
        if (next >= 100) {
          window.clearInterval(interval);
        }
        return next;
      });
    }, 220);

    return () => window.clearInterval(interval);
  }, [processing]);

  const safeBooking = useMemo(() => bookingData || {}, [bookingData]);
  const totalPrice = Number(safeBooking.pricePerHour || 0) * Number(safeBooking.durationHours || 1);
  const invalidBooking =
    !safeBooking.locationId ||
    !safeBooking.slotNumber ||
    !safeBooking.locationName ||
    !safeBooking.bookingDate ||
    !safeBooking.startTime ||
    !(Number(safeBooking.durationHours) > 0) ||
    !(Number(safeBooking.pricePerHour) >= 0);

  const toast = useCallback((message, type = "success") => {
    window.dispatchEvent(new CustomEvent("parkease-toast", { detail: { message, type } }));
  }, []);

  const saveBooking = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/api/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          locationId: safeBooking.locationId,
          slotNumber: safeBooking.slotNumber,
          locationName: safeBooking.locationName,
          pricePerHour: Number(safeBooking.pricePerHour),
          bookingDate: safeBooking.bookingDate,
          startTime: safeBooking.startTime,
          durationHours: Number(safeBooking.durationHours),
          startsAt: safeBooking.startsAt,
          endsAt: safeBooking.endsAt,
        }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(result.message || "Could not complete booking");
      }
      const confirmedBooking = {
        ...safeBooking,
        ...(result.data || {}),
        id: result.id || result.data?.id,
      };
      const qrCode = result.qrCode || result.data?.qrCode || `${safeBooking.locationId}-${safeBooking.slotNumber}-${Date.now()}`;
      localStorage.setItem("qrCode", qrCode);
      localStorage.setItem("lastBooking", JSON.stringify(confirmedBooking));
      localStorage.removeItem("parkingBooking");
      localStorage.removeItem("booking");
      toast("Booking confirmed 🎉", "success");
      window.setTimeout(() => navigate("/qrcode"), 1300);
    } catch (err) {
      console.error("Payment save error:", err);
      setError(err.message || "Payment failed. Try again.");
      setProcessing(false);
      setProgress(0);
    }
  }, [navigate, safeBooking, toast]);

  useEffect(() => {
    if (progress === 100 && processing) {
      saveBooking();
    }
  }, [progress, processing, saveBooking]);

  const startPayment = () => {
    if (invalidBooking) {
      setError("Please select a valid slot before payment.");
      return;
    }
    setError(null);
    setActiveStep(3);
    setProcessing(true);
    setProgress(0);
  };

  if (!bookingData) {
    return (
      <main className="page center-state">
        <section className="panel card-panel">
          <p className="status error">No pending booking was found.</p>
          <button className="btn btn-full" onClick={() => navigate("/")}>
            Find Parking
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="page">
      <button className="btn btn-ghost back-button" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <div className="section-header">
        <div>
          <h1 className="page-title">Payment & Review</h1>
          <p className="page-subtitle">Complete your booking with a premium payment experience.</p>
        </div>
      </div>

      <div className="stepper">
        {[
          { label: "Select Slot", active: activeStep >= 1 },
          { label: "Review", active: activeStep >= 2 },
          { label: "Pay", active: activeStep >= 3 },
          { label: "Done", active: activeStep >= 4 },
        ].map((step, index) => (
          <div key={step.label} className={`step-item ${step.active ? "active" : ""}`}>
            <div className="step-index">{index + 1}</div>
            <div className="step-label">{step.label}</div>
          </div>
        ))}
      </div>

      {error && <p className="status error">{error}</p>}

      <div className="payment-grid">
        <section className="panel card-panel">
          <h2>Order summary</h2>
          <div className="summary-panel">
            <div className="ticket-row">
              <span className="muted">Parking</span>
              <strong>{safeBooking.locationName}</strong>
            </div>
            <div className="ticket-row">
              <span className="muted">Slot</span>
              <strong>{safeBooking.slotNumber}</strong>
            </div>
            <div className="ticket-row">
              <span className="muted">Date</span>
              <strong>{safeBooking.bookingDate}</strong>
            </div>
            <div className="ticket-row">
              <span className="muted">Time</span>
              <strong>{safeBooking.startTime}</strong>
            </div>
            <div className="ticket-row">
              <span className="muted">Duration</span>
              <strong>{safeBooking.durationHours || 1} hr</strong>
            </div>
            <div className="ticket-row">
              <span className="muted">Total</span>
              <strong>₹{totalPrice}</strong>
            </div>
          </div>
        </section>

        <section className="panel card-panel">
          <h2>Choose payment</h2>

          <div className="payment-methods">
            {[
              { id: "upi", title: "UPI", subtitle: "Fast wallet payments", icon: "📱" },
              { id: "card", title: "Card", subtitle: "Debit / credit card", icon: "💳" },
              { id: "netbanking", title: "Net Banking", subtitle: "Bank transfer", icon: "🏦" },
              { id: "wallet", title: "Wallet", subtitle: "GPay / Paytm / PhonePe", icon: "🪙" },
            ].map((option) => (
              <button
                key={option.id}
                type="button"
                className={`payment-method-card ${paymentMethod === option.id ? "active" : ""}`}
                onClick={() => setPaymentMethod(option.id)}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <span>{option.icon}</span>
                  <div>
                    <strong>{option.title}</strong>
                    <p style={{ margin: 0, color: "var(--muted)", fontSize: "0.95rem" }}>{option.subtitle}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div style={{ marginTop: "24px" }}>
            {paymentMethod === "upi" && (
              <div className="form-card">
                <p className="muted">Choose a UPI app</p>
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "16px" }}>
                  {[
                    { name: "GPay", icon: "🟦" },
                    { name: "PhonePe", icon: "🟪" },
                    { name: "Paytm", icon: "🟦" },
                  ].map((item) => (
                    <button
                      key={item.name}
                      type="button"
                      className={`payment-method-card ${upiOption === item.name ? "active" : ""}`}
                      onClick={() => setUpiOption(item.name)}
                    >
                      <span>{item.icon}</span>
                      <span>{item.name}</span>
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  placeholder="name@upi"
                  value={upiOption}
                  onChange={(event) => setUpiOption(event.target.value)}
                  style={{
                    marginTop: "18px",
                    width: "100%",
                    borderRadius: "18px",
                    border: "1px solid var(--border)",
                    padding: "16px",
                    background: "var(--surface)",
                  }}
                />
              </div>
            )}

            {paymentMethod === "card" && (
              <div className="form-card">
                <div className="card-preview">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span>ParkEase</span>
                    <span>💳</span>
                  </div>
                  <span style={{ fontSize: "1.1rem", letterSpacing: "0.24em" }}>
                    {cardNumber.padEnd(16, "*").replace(/(.{4})/g, "$1 ").trim()}
                  </span>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span>{cardName || "CARD HOLDER"}</span>
                    <span>{cardExpiry || "MM/YY"}</span>
                  </div>
                </div>
                <input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  value={cardNumber}
                  onChange={(event) => setCardNumber(event.target.value)}
                  style={{ width: "100%", borderRadius: "18px", border: "1px solid var(--border)", padding: "16px", marginTop: "18px", background: "var(--surface)" }}
                />
                <input
                  type="text"
                  placeholder="Card holder name"
                  value={cardName}
                  onChange={(event) => setCardName(event.target.value)}
                  style={{ width: "100%", borderRadius: "18px", border: "1px solid var(--border)", padding: "16px", marginTop: "12px", background: "var(--surface)" }}
                />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginTop: "12px" }}>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    value={cardExpiry}
                    onChange={(event) => setCardExpiry(event.target.value)}
                    style={{ borderRadius: "18px", border: "1px solid var(--border)", padding: "16px", background: "var(--surface)" }}
                  />
                  <input
                    type="text"
                    placeholder="CVV"
                    value={cardCvv}
                    onChange={(event) => setCardCvv(event.target.value)}
                    style={{ borderRadius: "18px", border: "1px solid var(--border)", padding: "16px", background: "var(--surface)" }}
                  />
                </div>
              </div>
            )}

            {paymentMethod === "netbanking" && (
              <div className="form-card">
                <p className="muted">Select your bank</p>
                <select
                  value={bank}
                  onChange={(event) => setBank(event.target.value)}
                  style={{ width: "100%", borderRadius: "18px", border: "1px solid var(--border)", padding: "16px", marginTop: "16px", background: "var(--surface)" }}
                >
                  {['SBI', 'HDFC', 'ICICI', 'Axis', 'Kotak'].map((bankName) => (
                    <option key={bankName} value={bankName}>
                      {bankName}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {paymentMethod === "wallet" && (
              <div className="form-card">
                <p className="muted">Choose a wallet to pay</p>
                <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginTop: "16px" }}>
                  {['GPay', 'Paytm', 'PhonePe'].map((wallet) => (
                    <button
                      key={wallet}
                      type="button"
                      className={`payment-method-card ${walletOption === wallet ? "active" : ""}`}
                      onClick={() => setWalletOption(wallet)}
                    >
                      {wallet}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div style={{ marginTop: "24px" }}>
            <div style={{ height: "12px", background: "var(--surface-soft)", borderRadius: "999px", overflow: "hidden" }}>
              <div
                style={{
                  width: `${progress}%`,
                  height: "100%",
                  background: `linear-gradient(90deg, ${progress > 0 ? "#6C63FF" : "#d7d9e5"}, ${progress > 0 ? "#FF6B6B" : "#d7d9e5"})`,
                  transition: "width 0.2s ease",
                }}
              />
            </div>
            <p style={{ marginTop: "10px", color: "var(--muted)", fontSize: "0.95rem" }}>
              {processing ? `Processing payment ${progress}%` : "Ready to complete your booking."}
            </p>
          </div>

          <button className="btn btn-full" onClick={startPayment} disabled={processing} style={{ marginTop: "22px" }}>
            {processing ? (
              <>
                <span className="spinner" /> Processing...
              </>
            ) : (
              `Pay ₹${totalPrice}`
            )}
          </button>
        </section>
      </div>
    </main>
  );
}

export default BookingConfirm;
