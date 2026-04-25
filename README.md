# ParkEase 🚗

A real-time parking slot booking system built during a 24-hour hackathon.

---

## The Problem

Finding parking in busy areas like malls, hospitals, and markets is a daily frustration. Drivers spend 15–20 minutes just circling around looking for a free spot with no way to know availability in advance.

## Our Solution

ParkEase lets you browse nearby parking locations, see live slot availability, and book a spot in advance — similar to how you'd book a movie seat. Walk straight to your spot, no searching required.

---

## Features

- Browse parking locations near you
- Visual slot grid showing live availability
- Book instantly or schedule in advance
- QR code generated on booking for entry/exit
- View and manage your bookings

---

## Tech Stack

- **Frontend** — React
- **Backend** — Node.js + Express
- **Database** — Firebase Firestore
- **Maps** — Google Maps API
- **QR Code** — qrcode.react

---

## Project Structure

```
parkease/
├── frontend/
│   ├── public/
│   │   └── index.html
│   └── src/
│       ├── index.js
│       ├── App.js
│       ├── firebase.js
│       ├── pages/
│       │   ├── Home.js
│       │   ├── SlotSelection.js
│       │   ├── BookingConfirm.js
│       │   ├── QRCodePage.js
│       │   └── MyBookings.js
│       └── components/
│           ├── Navbar.js
│           ├── ParkingCard.js
│           └── SlotGrid.js
├── backend/
│   ├── server.js
│   ├── firebase-admin.js
│   └── routes/
│       ├── parkingRoutes.js
│       ├── bookingRoutes.js
│       └── qrRoutes.js
├── firestore-seed.js
└── .env
```

---



## How It Works

1. User opens the app and sees nearby parking locations
2. Selects a location to view the slot grid
3. Picks an available slot and confirms the booking
4. A QR code is generated — used for entry and exit at the gate
5. Booking is saved in Firestore and visible under My Bookings

---

## Firestore Structure

```
parkingLocations/
  {locationId}/
    name, address, totalSlots, pricePerHour, lat, lng

bookings/
  {bookingId}/
    userId, locationId, slotNumber, startTime, endTime, status, qrCode
```

---
