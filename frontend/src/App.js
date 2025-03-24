import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Calendar from "./pages/Calendar";
import HabitTracker from "./pages/HabitTracker";
import Layout from "./components/Layout";
import { auth } from "./firebase";
import SignUp from "./components/SignUp";
import Login from "./components/Login";
import Logout from "./components/Logout";

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div>
      {!user ? (
        <div>
          <SignUp />
          <Login />
        </div>
      ) : (
        <Router>
          <Layout>
            <div>
              <h1>Welcome, {user.email}!</h1>
              <Logout />
            </div>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/habit-tracker" element={<HabitTracker />} />
              <Route path="/calendar" element={<Calendar />} />
            </Routes>
          </Layout>
        </Router>
      )}
    </div>
  );
};

export default App;
