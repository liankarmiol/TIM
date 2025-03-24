const express = require("express");
const cors = require("cors");
const logRoutes = require("./routes/logRoutes");

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Test Route
app.get("/", (req, res) => {
  res.send("Hello from the backend!");
});

// Use routes
app.use("/api/logs", logRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
