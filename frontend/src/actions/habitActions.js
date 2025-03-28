import axios from "axios";
import { query, collection, where, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { doc, deleteDoc } from "firebase/firestore";

/**
 * Create a new habit for the current user
 * @param {string} userId
 * @param {object} habitData - { name }
 * @returns {Promise<object>} Created habit
 */
export const createHabit = async (userId, habitData) => {
  try {
    const response = await axios.post("/api/habits", { userId, ...habitData });
    return response.data;
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
    const response = await axios.get(`/api/habits/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error getting habits:", error);
    throw error;
  }
};

/**
 * Toggle habit completion for a specific date
 * @param {string} userId
 * @param {string} habitId
 * @param {string} date
 */
export const toggleHabitCompletion = async (userId, habitId, date) => {
  try {
    const response = await axios.put(`/api/habits/${userId}/${habitId}`, {
      date,
    });
    return response.data;
  } catch (error) {
    console.error("Error toggling habit completion:", error);
    throw error;
  }
};

/**
 * Get completions for a habit within a date range
 * @param {string} userId
 * @param {string} habitId
 * @param {Date} startDate
 * @param {Date} endDate
 * @returns {Promise<Array>} Array of completion objects
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
      where("date", ">=", startDate),
      where("date", "<=", endDate)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error getting habit completions:", error);
    throw error;
  }
};

/**
 * Delete a habit
 * @param {string} userId
 * @param {string} habitId
 * @returns {Promise<void>}
 */
export const deleteHabit = async (userId, habitId) => {
  try {
    const habitRef = doc(db, "habits", habitId);
    await deleteDoc(habitRef);
  } catch (error) {
    console.error("Error deleting habit:", error);
    throw error;
  }
};
