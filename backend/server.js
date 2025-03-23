const express = require("express");
const firebaseAdmin = require("firebase-admin");
const path = require("path");
const app = express();
const port = 5000; // Or any port of your choice

const cors = require("cors");

app.use(cors()); // This will allow all domains. You can specify domains if needed.

// Initialize Firebase Admin with the service account credentials
const serviceAccount = require(path.join(__dirname, "firebase_key.json")); // Path to your firebase_key.json file

firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccount),
});

// Set up a simple route to test the server
app.get("/", (req, res) => {
  res.send("Hello from the backend!");
});

// Example of a POST route to save a log to Firebase
app.post("/log", express.json(), async (req, res) => {
  const logData = req.body;

  console.log("Request Body:", logData); // Log the received data to check if it's parsed correctly

  try {
    // Add log data to Firebase Firestore
    const db = firebaseAdmin.firestore();
    await db.collection("logs").add(logData);

    res.status(200).send("Log saved successfully!");
  } catch (error) {
    console.error("Error saving log:", error);
    res.status(500).send("Error saving log");
  }
});

// // Route to fetch logs from Firebase
// app.get("/logs", async (req, res) => {
//   try {
//     const db = firebaseAdmin.firestore();
//     const logsSnapshot = await db.collection("logs").get();

//     // Format the data
//     const logs = logsSnapshot.docs.map((doc) => ({
//       id: doc.id,
//       ...doc.data(),
//     }));

//     res.status(200).json(logs);
//   } catch (error) {
//     console.error("Error fetching logs:", error);
//     res.status(500).send("Error fetching logs");
//   }
// });

// app.get("/api/logs", async (req, res) => {
//   try {
//     const db = firebaseAdmin.firestore();
//     const logsSnapshot = await db.collection("logs").get();

//     const logs = logsSnapshot.docs.map((doc) => {
//       const data = doc.data();
//       return {
//         id: doc.id,
//         date: data.date?.toDate().toISOString().split("T")[0],
//         maskingLevel: data.maskingLevel || 0,
//       };
//     });

//     res.setHeader("Content-Type", "application/json"); // ✅ Ensure JSON response
//     res.status(200).json(logs);
//   } catch (error) {
//     console.error("Error fetching logs:", error);
//     res.status(500).send("Error fetching logs");
//   }
// });

// Get logs from Firestore
app.get("/api/logs", async (req, res) => {
  try {
    const db = firebaseAdmin.firestore();
    const snapshot = await db.collection("logs").get();

    const logs = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(), // Spread the full document data
    }));

    console.log("Logs from Firebase:", logs);
    res.status(200).json(logs); // Send full logs as JSON
  } catch (error) {
    console.error("Error fetching logs:", error);
    res.status(500).send("Error fetching logs");
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
