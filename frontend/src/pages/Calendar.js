// src/pages/Calendar.js
import React, { useState } from "react";
import Calendar from "react-calendar";
import { useNavigate } from "react-router-dom";
import "react-calendar/dist/Calendar.css";

function CalendarPage() {
  const [date, setDate] = useState(new Date());
  const navigate = useNavigate();

  return (
    <div>
      <div>
        <h2>Calendar</h2>
        <Calendar onChange={setDate} value={date} />
        <div>
          <button onClick={() => navigate(-1)}>Back</button>
        </div>
      </div>
    </div>
  );
}

export default CalendarPage;
