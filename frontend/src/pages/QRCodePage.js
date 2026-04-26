import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";

function QRCodePage() {
  const navigate = useNavigate();
  const [shareText, setShareText] = useState("");

  useEffect(() => {
    document.title = "ParkEase - Ticket";
  }, []);

  const booking = useMemo(() => {
    const stored = localStorage.getItem("lastBooking") || localStorage.getItem("parkingBooking");
    return stored ? JSON.parse(stored) : null;
  }, []);

  const qrPayload = booking ? `${booking.locationName}|${booking.slotNumber}|${booking.bookingDate}|${booking.total}` : "";

  const handleShare = async () => {
    const message = `ParkEase ticket for ${booking?.locationName || "your reservation"} - Slot ${booking?.slotNumber}.`;
    if (navigator.share) {
      try {
        await navigator.share({ title: "ParkEase Ticket", text: message, url: window.location.href });
        setShareText("Ticket shared successfully.");
      } catch (err) {
        setShareText("Unable to share right now.");
      }
    } else if (navigator.clipboard) {
      await navigator.clipboard.writeText(`${message} ${window.location.href}`);
      setShareText("Ticket link copied to clipboard.");
    }
  };

  const handleDownload = () => {
    const canvas = document.querySelector("canvas");
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = "parkease-ticket.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  if (!booking) {
    return (
      <main className="page">
        <section className="section-header">
          <h2>Missing ticket details</h2>
          <p className="section-subtitle">Return to the booking flow to generate your QR ticket.</p>
          <button className="btn btn-secondary" onClick={() => navigate("/")}>
            Back to home
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="page ticket-page">
      <section className="ticket-shell">
        <div className="ticket-preview">
          <div className="ticket-header">
            <div>
              <span className="hero-kicker">Digital Ticket</span>
              <h1>ParkEase Pass</h1>
            </div>
            <span>Valid now</span>
          </div>

          <div className="ticket-body">
            <div className="ticket-info-block">
              <span>Location</span>
              <strong>{booking.locationName}</strong>
            </div>
            <div className="ticket-info-block">
              <span>Slot</span>
              <strong>{booking.slotNumber}</strong>
            </div>
            <div className="ticket-info-block">
              <span>Date</span>
              <strong>{booking.bookingDate}</strong>
            </div>
            <div className="ticket-info-block">
              <span>Amount</span>
              <strong>₹{booking.total}</strong>
            </div>
          </div>

          <div className="ticket-qr-card">
            <QRCodeCanvas value={qrPayload} size={200} fgColor="#3f3d56" bgColor="#ffffff" />
            <p className="section-subtitle">Scan at the gate to unlock your slot.</p>
          </div>

          <div className="ticket-actions">
            <button className="btn btn-outline" type="button" onClick={handleShare}>
              Share ticket
            </button>
            <button className="btn btn-secondary" type="button" onClick={handleDownload}>
              Download QR
            </button>
          </div>
          {shareText && <p className="status success">{shareText}</p>}
        </div>
      </section>
    </main>
  );
}

export default QRCodePage;
