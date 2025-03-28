const express = require("express");
const router = express.Router();
const { db } = require("../firebase/firebase-config");

// POST route to save a log to Firebase
router.post("/", async (req, res) => {
  const logData = req.body;
  console.log("Request Body:", logData);

  try {
    await db.collection("logs").add(logData);
    res.status(200).send("Log saved successfully!");
  } catch (error) {
    console.error("Error saving log:", error);
    res.status(500).send("Error saving log");
  }
});

// GET route to retrieve logs from Firebase
router.get("/", async (req, res) => {
  try {
    const snapshot = await db.collection("logs").get();
    const logs = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    console.log("Logs from Firebase:", logs);
    res.status(200).json(logs);
  } catch (error) {
    console.error("Error fetching logs:", error);
    res.status(500).send("Error fetching logs");
  }
});

module.exports = router;
