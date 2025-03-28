import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Calendar from "./pages/Calendar";
import HabitTracker from "./pages/HabitTracker";
import Layout from "./components/Layout";
import { auth } from "./firebase";
import SignUp from "./components/SignUp";
import Login from "./components/Login";
import Logout from "./components/Logout";
import "./styles/AppStyles.css";
import { onAuthStateChanged } from "firebase/auth";

const App = () => {
  const [user, setUser] = useState(null);
  const [isLoginMode, setIsLoginMode] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("Firebase initialized!", user ? "User logged in" : "No user");
      setUser(user);
    });
    return unsubscribe;
  }, []);

  const toggleAuthMode = () => {
    setIsLoginMode((prevMode) => !prevMode);
  };

  return (
    <div>
      {!user ? (
        <div>
          {isLoginMode ? (
            <Login toggleAuthMode={toggleAuthMode} />
          ) : (
            <SignUp toggleAuthMode={toggleAuthMode} />
          )}
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
