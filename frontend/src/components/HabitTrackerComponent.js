import React, { useState, useEffect } from "react";
import {
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameDay,
  addWeeks,
  subWeeks,
} from "date-fns";
import { auth } from "../firebase";
import {
  createHabit,
  getHabits,
  toggleHabitCompletion,
  getHabitCompletions,
  deleteHabit,
} from "../actions/habitActions";
import "../styles/HabitTracker.css";

const HabitTracker = () => {
  const [habits, setHabits] = useState([]);
  const [newHabitName, setNewHabitName] = useState("");
  const [selectedWeek, setSelectedWeek] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedColor, setSelectedColor] = useState("#4CAF50");

  // Generate week days
  const weekDays = eachDayOfInterval({
    start: startOfWeek(selectedWeek),
    end: endOfWeek(selectedWeek),
  });

  // Fetch habits and completions
  useEffect(() => {
    const fetchData = async () => {
      const user = auth.currentUser;
      if (!user) {
        setError("User not authenticated");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Get habits
        const userHabits = await getHabits(user.uid);

        // Get completions for each habit for the current week
        const habitsWithCompletions = await Promise.all(
          userHabits.map(async (habit) => {
            const completions = await getHabitCompletions(
              user.uid,
              habit.id,
              startOfWeek(selectedWeek),
              endOfWeek(selectedWeek)
            );
            return { ...habit, completions };
          })
        );

        setHabits(habitsWithCompletions);
      } catch (err) {
        console.error("Error loading data:", err);
        setError("Failed to load habits. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedWeek]);

  const handleAddHabit = async (e) => {
    e.preventDefault();
    if (!newHabitName.trim()) {
      setError("Habit name cannot be empty");
      return;
    }

    try {
      const user = auth.currentUser;
      if (!user) throw new Error("User not authenticated");

      const habitId = await createHabit(user.uid, {
        name: newHabitName,
        color: selectedColor,
      });

      setHabits([
        ...habits,
        {
          id: habitId,
          name: newHabitName,
          color: selectedColor,
          completions: [],
        },
      ]);

      // Reset form
      setNewHabitName("");
      setSelectedColor("#4CAF50");
      setShowAddForm(false);
      setError(null);
    } catch (err) {
      console.error("Error adding habit:", err);
      setError(err.message);
    }
  };

  const handleToggleCompletion = async (habitId, day) => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("User not authenticated");

      const habit = habits.find((h) => h.id === habitId);
      const completion = habit.completions.find((c) => isSameDay(c.date, day));

      const newCompleted = !(completion?.completed || false);

      await toggleHabitCompletion(user.uid, habitId, day, newCompleted);

      // Update local state
      setHabits(
        habits.map((h) => {
          if (h.id === habitId) {
            const existingIndex = h.completions.findIndex((c) =>
              isSameDay(c.date, day)
            );

            if (existingIndex >= 0) {
              const updatedCompletions = [...h.completions];
              updatedCompletions[existingIndex].completed = newCompleted;
              return { ...h, completions: updatedCompletions };
            } else {
              return {
                ...h,
                completions: [
                  ...h.completions,
                  { date: day, completed: newCompleted },
                ],
              };
            }
          }
          return h;
        })
      );
    } catch (err) {
      console.error("Error toggling completion:", err);
      setError(err.message);
    }
  };

  const handleDeleteHabit = async (habitId) => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("User not authenticated");

      await deleteHabit(user.uid, habitId);
      setHabits(habits.filter((h) => h.id !== habitId));
    } catch (err) {
      console.error("Error deleting habit:", err);
      setError(err.message);
    }
  };

  const navigateWeek = (direction) => {
    setSelectedWeek((prev) =>
      direction === "next" ? addWeeks(prev, 1) : subWeeks(prev, 1)
    );
  };

  const colorOptions = [
    "#4CAF50", // Green
    "#2196F3", // Blue
    "#9C27B0", // Purple
    "#FF9800", // Orange
    "#E91E63", // Pink
    "#607D8B", // Gray
  ];

  if (loading) {
    return <div className="loading">Loading your habits...</div>;
  }

  return (
    <div className="habit-tracker">
      <div className="header">
        <h1>Habit Tracker</h1>
        <div className="week-navigation">
          <button onClick={() => navigateWeek("prev")} className="nav-button">
            &lt; Previous Week
          </button>
          <span className="week-range">
            {format(startOfWeek(selectedWeek), "MMM d")} -{" "}
            {format(endOfWeek(selectedWeek), "MMM d")}
          </span>
          <button onClick={() => navigateWeek("next")} className="nav-button">
            Next Week &gt;
          </button>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {!showAddForm ? (
        <button
          onClick={() => setShowAddForm(true)}
          className="add-habit-button"
        >
          + Add New Habit
        </button>
      ) : (
        <form onSubmit={handleAddHabit} className="add-habit-form">
          <div className="form-group">
            <label htmlFor="habitName">Habit Name:</label>
            <input
              id="habitName"
              type="text"
              value={newHabitName}
              onChange={(e) => setNewHabitName(e.target.value)}
              placeholder="e.g., Drink water, Exercise"
              required
            />
          </div>

          <div className="form-group">
            <label>Color:</label>
            <div className="color-options">
              {colorOptions.map((color) => (
                <div
                  key={color}
                  className={`color-option ${
                    selectedColor === color ? "selected" : ""
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => setSelectedColor(color)}
                />
              ))}
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="submit-button">
              Add Habit
            </button>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="cancel-button"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="habits-container">
        {habits.length === 0 ? (
          <div className="no-habits">
            {showAddForm
              ? "Add your first habit above!"
              : 'No habits yet. Click "Add New Habit" to get started.'}
          </div>
        ) : (
          <table className="habits-grid">
            <thead>
              <tr>
                <th className="habit-header">Habit</th>
                {weekDays.map((day) => (
                  <th key={day.toString()} className="day-header">
                    {format(day, "EEE")}
                    <div className="day-date">{format(day, "d")}</div>
                  </th>
                ))}
                <th className="actions-header">Actions</th>
              </tr>
            </thead>
            <tbody>
              {habits.map((habit) => (
                <tr key={habit.id} className="habit-row">
                  <td className="habit-name" style={{ color: habit.color }}>
                    {habit.name}
                  </td>
                  {weekDays.map((day) => {
                    const completion = habit.completions.find((c) =>
                      isSameDay(c.date, day)
                    );
                    const isCompleted = completion?.completed || false;

                    return (
                      <td
                        key={day.toString()}
                        className={`day-cell ${isCompleted ? "completed" : ""}`}
                        onClick={() => handleToggleCompletion(habit.id, day)}
                      >
                        {isCompleted ? "✓" : ""}
                      </td>
                    );
                  })}
                  <td className="actions-cell">
                    <button
                      onClick={() => handleDeleteHabit(habit.id)}
                      className="delete-button"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default HabitTracker;
