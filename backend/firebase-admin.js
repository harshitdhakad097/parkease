const admin = require("firebase-admin");

const demoData = {
  parkingLocations: [
    {
      id: "central-plaza",
      name: "Central Plaza Parking",
      address: "MG Road, Near City Mall",
      totalSlots: 36,
      pricePerHour: 60,
    },
    {
      id: "metro-gate",
      name: "Metro Gate Parking",
      address: "Station Road, Gate 2",
      totalSlots: 28,
      pricePerHour: 45,
    },
    {
      id: "tech-park",
      name: "Tech Park Basement",
      address: "Innovation Avenue, Block C",
      totalSlots: 42,
      pricePerHour: 75,
    },
  ],
  bookings: [],
};

const createDocSnapshot = (id, data) => ({
  id,
  exists: Boolean(data),
  data: () => data,
});

const createMemoryDb = () => ({
  isDemoMode: true,
  collection(name) {
    if (!demoData[name]) demoData[name] = [];

    return {
      async get() {
        const docs = demoData[name].map((item) => createDocSnapshot(item.id, item));
        return {
          empty: docs.length === 0,
          docs,
        };
      },
      doc(id) {
        return {
          async get() {
            const item = demoData[name].find((entry) => entry.id === id);
            return createDocSnapshot(id, item);
          },
          async update(data) {
            const index = demoData[name].findIndex((entry) => entry.id === id);
            if (index === -1) {
              throw new Error("Document not found");
            }
            demoData[name][index] = {
              ...demoData[name][index],
              ...data,
            };
          },
        };
      },
      async add(data) {
        const id = `${name}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
        demoData[name].unshift({ id, ...data, createdAt: data.createdAt || new Date().toISOString() });
        return { id };
      },
    };
  },
});

let db;

try {
  const serviceAccount = require("./serviceAccountKey.json");

  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  }

  db = admin.firestore();
} catch (error) {
  console.warn("Firebase Admin is not configured. Running with in-memory demo data.");
  console.warn(error.message);
  db = createMemoryDb();
}

module.exports = db;
