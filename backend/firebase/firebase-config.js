const firebaseAdmin = require("firebase-admin");
const path = require("path");

// Initialize Firebase Admin with the service account credentials
const serviceAccount = require(path.join(__dirname, "../firebase_key.json"));

firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccount),
});

const db = firebaseAdmin.firestore();

module.exports = { db };
