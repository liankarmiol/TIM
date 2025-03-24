import React from "react";
import { logout } from "../authActions";

const Logout = () => {
  return <button onClick={logout}>Log Out</button>;
};

export default Logout;
