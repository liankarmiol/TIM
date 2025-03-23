import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Calendar from "./pages/Calendar";
import HabitTracker from "./pages/HabitTracker";
import Layout from "./components/Layout";

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/habit-tracker" element={<HabitTracker />} />
          <Route path="/calendar" element={<Calendar />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
