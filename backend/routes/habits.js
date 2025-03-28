const express = require("express");
const router = express.Router();
const db = require("../firebase/firebase-config"); // Use the backend's Firebase configuration

// Get all habits for a user
router.get("/:userId", async (req, res) => {
  const userId = req.params.userId;
  try {
    const habitsRef = db.collection("habits");
    const snapshot = await habitsRef.where("userId", "==", userId).get();

    if (snapshot.empty) {
      return res.json([]);
    }

    const habits = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json(habits);
  } catch (error) {
    console.error("Error fetching habits:", error);
    res.status(500).json({ message: "Failed to fetch habits" });
  }
});

// Add a new habit
router.post("/", async (req, res) => {
  const { userId, name } = req.body;
  try {
    const habitRef = await db.collection("habits").add({
      userId,
      name,
      createdAt: new Date(),
    });

    res.status(201).json({ id: habitRef.id, userId, name });
  } catch (error) {
    console.error("Error adding habit:", error);
    res.status(500).json({ message: "Failed to add habit" });
  }
});

// Toggle habit completion
router.put("/:userId/:habitId", async (req, res) => {
  const { userId, habitId } = req.params;
  const { date } = req.body;

  try {
    const habitRef = db.collection("habits").doc(habitId);
    const habitDoc = await habitRef.get();

    if (!habitDoc.exists) {
      return res.status(404).json({ message: "Habit not found" });
    }

    const habitData = habitDoc.data();
    const completedDates = habitData.completedDates || [];

    if (completedDates.includes(date)) {
      // Remove the date if it exists
      const updatedDates = completedDates.filter((d) => d !== date);
      await habitRef.update({ completedDates: updatedDates });
    } else {
      // Add the date if it doesn't exist
      completedDates.push(date);
      await habitRef.update({ completedDates });
    }

    res.json({ id: habitId, completedDates });
  } catch (error) {
    console.error("Error toggling habit completion:", error);
    res.status(500).json({ message: "Failed to toggle habit completion" });
  }
});

module.exports = router;
