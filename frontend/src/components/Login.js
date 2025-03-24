import React, { useState } from "react";
import { login } from "../authActions";
import "../styles/Auth.css";

const Login = ({ toggleAuthMode }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    login(email, password)
      .then((user) => {
        console.log("Login successful:", user);
        setError(null); // Clear any previous errors
      })
      .catch((error) => {
        console.error("Login failed:", error);
        setError(error.message); // Set the error message
      });
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
          <button type="submit">Log In</button>
          {error && <p className="auth-error">{error}</p>}{" "}
          {/* Display error message */}
        </form>
        <p>
          Don't have an account?{" "}
          <button onClick={toggleAuthMode} className="auth-switch">
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
