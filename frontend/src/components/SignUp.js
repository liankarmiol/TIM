import React, { useState } from "react";
import { signUp } from "../actions/authActions";
import "../styles/Auth.css";

const SignUp = ({ toggleAuthMode }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    signUp(email, password)
      .then((user) => {
        console.log("Sign-up successful:", user);
        setError(null); // Clear any previous errors
      })
      .catch((error) => {
        console.error("Sign-up failed:", error);
        setError(error.message); // Set the error message
      });
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Sign Up</h2>
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
          <button type="submit">Sign Up</button>
          {error && <p className="auth-error">{error}</p>}{" "}
          {/* Display error message */}
        </form>
        <p>
          Already have an account?{" "}
          <button onClick={toggleAuthMode} className="auth-switch">
            Log In
          </button>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
