// src/actions/habitActions.js
import { db } from "../firebase";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";

/**
 * Create a new habit for the current user
 * @param {string} userId
 * @param {object} habitData - { name, color?, targetDays? }
 * @returns {Promise<string>} habitId
 */
export const createHabit = async (userId, habitData) => {
  try {
    const docRef = await addDoc(collection(db, "habits"), {
      ...habitData,
      userId,
      createdAt: serverTimestamp(),
      // Default values
      color: habitData.color || "#4CAF50",
      targetDays: habitData.targetDays || [],
    });
    return docRef.id;
  } catch (error) {
    console.error("Error creating habit:", error);
    throw error;
  }
};

/**
 * Get all habits for a user
 * @param {string} userId
 * @returns {Promise<Array>} Array of habit objects
 */
export const getHabits = async (userId) => {
  try {
    const q = query(collection(db, "habits"), where("userId", "==", userId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      // Convert Firestore Timestamp to JS Date
      createdAt: doc.data().createdAt?.toDate() || new Date(),
    }));
  } catch (error) {
    console.error("Error getting habits:", error);
    throw error;
  }
};

/**
 * Toggle habit completion for a specific date
 * @param {string} userId
 * @param {string} habitId
 * @param {Date} date
 * @param {boolean} completed
 * @param {string} notes
 */
export const toggleHabitCompletion = async (
  userId,
  habitId,
  date,
  completed,
  notes = ""
) => {
  try {
    // Normalize date to start of day for consistent comparison
    const dateStart = new Date(date);
    dateStart.setHours(0, 0, 0, 0);

    const completionsRef = collection(db, "completions");
    const q = query(
      completionsRef,
      where("userId", "==", userId),
      where("habitId", "==", habitId),
      where("date", "==", Timestamp.fromDate(dateStart))
    );

    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      // Create new completion record
      await addDoc(completionsRef, {
        userId,
        habitId,
        date: Timestamp.fromDate(dateStart),
        completed,
        notes,
        updatedAt: serverTimestamp(),
      });
    } else {
      // Update existing record
      const docRef = doc(db, "completions", snapshot.docs[0].id);
      await updateDoc(docRef, {
        completed,
        notes,
        updatedAt: serverTimestamp(),
      });
    }
  } catch (error) {
    console.error("Error updating completion:", error);
    throw error;
  }
};

/**
 * Get all completions for a habit within a date range
 * @param {string} userId
 * @param {string} habitId
 * @param {Date} startDate
 * @param {Date} endDate
 * @returns {Promise<Array>} Array of completion records
 */
export const getHabitCompletions = async (
  userId,
  habitId,
  startDate,
  endDate
) => {
  try {
    const completionsRef = collection(db, "completions");
    const q = query(
      completionsRef,
      where("userId", "==", userId),
      where("habitId", "==", habitId),
      where("date", ">=", Timestamp.fromDate(startDate)),
      where("date", "<=", Timestamp.fromDate(endDate))
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      date: doc.data().date?.toDate() || new Date(),
    }));
  } catch (error) {
    console.error("Error getting completions:", error);
    throw error;
  }
};

/**
 * Delete a habit and all its completions
 * @param {string} userId
 * @param {string} habitId
 */
export const deleteHabit = async (userId, habitId) => {
  try {
    // First delete the habit
    await deleteDoc(doc(db, "habits", habitId));

    // Then delete all associated completions
    const completionsRef = collection(db, "completions");
    const q = query(
      completionsRef,
      where("userId", "==", userId),
      where("habitId", "==", habitId)
    );

    const snapshot = await getDocs(q);
    const deletePromises = snapshot.docs.map((doc) => deleteDoc(doc.ref));

    await Promise.all(deletePromises);
  } catch (error) {
    console.error("Error deleting habit:", error);
    throw error;
  }
};
