import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/AppStyles.css";

const MainNavigation = () => {
  const navigate = useNavigate();

  return (
    <nav>
      <ul>
        <li>
          <Link to="/">Dashboard</Link>
        </li>
        <li>
          <Link to="/habit-tracker">Habit Tracker</Link>
        </li>
        <li>
          <Link to="/calendar">Calendar</Link>
        </li>
        <li>
          <button onClick={() => navigate(-1)}>Back</button>
        </li>
      </ul>
    </nav>
  );
};

export default MainNavigation;
