// src/pages/HabitTracker.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function HabitTracker() {
  const [habit, setHabit] = useState("");
  const [habits, setHabits] = useState([]);
  const navigate = useNavigate();

  const handleAddHabit = () => {
    setHabits([...habits, habit]);
    setHabit("");
  };

  return (
    <div>
      <h2>Habit Tracker</h2>
      <input
        type="text"
        value={habit}
        onChange={(e) => setHabit(e.target.value)}
        placeholder="Enter habit"
      />
      <button onClick={handleAddHabit}>Add Habit</button>
      <ul>
        {habits.map((habit, index) => (
          <li key={index}>{habit}</li>
        ))}
      </ul>
      <div>
        <button onClick={() => navigate(-1)}>Back</button>
      </div>
    </div>
  );
}

export default HabitTracker;
