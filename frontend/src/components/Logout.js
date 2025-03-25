import React from "react";
import { logout } from "../actions/authActions";

const Logout = () => {
  return <button onClick={logout}>Log Out</button>;
};

export default Logout;
