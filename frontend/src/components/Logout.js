import React from "react";
import { logout } from "../authActions"; // Import the logout function

const Logout = () => {
  return <button onClick={logout}>Log Out</button>;
};

export default Logout;
