import React, { useEffect, useState } from "react";
import axios from "axios";
import MaskingLevelChart from "../components/MaskingLevelChart";

const Dashboard = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/logs")
      .then((response) => {
        console.log(response.data); // Ensure correct data format
        setLogs(response.data); // Save data to state
      })
      .catch((error) => console.error("Error fetching logs:", error));
  }, []);

  return (
    <div>
      <h2>Dashboard</h2>
      <div>
        <MaskingLevelChart logs={logs} />
      </div>
    </div>
  );
};

export default Dashboard;
