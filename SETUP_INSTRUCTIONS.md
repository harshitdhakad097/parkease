# Setup & Seeding Instructions

## Step 1: Get Firebase Credentials

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your ParkEase project
3. Click **Project Settings** (gear icon) → **Service Accounts**
4. Click **Generate New Private Key**
5. Copy the JSON content

## Step 2: Add Service Account Key

1. Save the JSON as `backend/serviceAccountKey.json`
2. (Make sure it's in .gitignore - already done!)

## Step 3: Configure Environment Variables

### Root .env
```
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY=your_private_key
FIREBASE_CLIENT_EMAIL=your_client_email
```

### frontend/.env
Get these from Firebase Console → Project Settings → Web App Configuration
```
REACT_APP_FIREBASE_API_KEY=xxx
REACT_APP_FIREBASE_AUTH_DOMAIN=xxx
REACT_APP_FIREBASE_PROJECT_ID=xxx
REACT_APP_FIREBASE_STORAGE_BUCKET=xxx
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=xxx
REACT_APP_FIREBASE_APP_ID=xxx
```

## Step 4: Seed the Database

Once you have the Firebase credentials in place:

```bash
# From root directory
npm run seed

# Or from backend directory
npm run seed
```

This will add 3 sample parking locations to Firestore:
- **Bandra Central Parking** (Mumbai) - ₹50/hour
- **Marine Drive Parking Hub** (Mumbai) - ₹75/hour
- **MG Road Parking Plaza** (Pune) - ₹40/hour

## Verify Seeding

1. Go to Firebase Console
2. Click **Firestore Database**
3. Check the **parkingLocations** collection
4. You should see 3 documents with parking location data

---

## Troubleshooting

**Error: "Cannot find module serviceAccountKey.json"**
- Make sure you saved it as `backend/serviceAccountKey.json`
- Check the file exists: `ls -la backend/serviceAccountKey.json`

**Error: "Invalid service account"**
- The JSON key format might be wrong
- Re-download from Firebase Console

**Error: "Permission denied on parkingLocations"**
- Check Firestore Security Rules allow writes
- For development, temporarily allow all writes (set rules to: `allow read, write: if true;`)
