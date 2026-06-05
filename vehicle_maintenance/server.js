require("dotenv").config();
const express = require("express");
const Log = require("../logging_middleware");
const { generateSchedule } = require("./scheduler");

const app = express();
const PORT = process.env.PORT || 3002;
const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:3001";

app.use(express.json());

/**
 * Health check endpoint
 */
app.get("/health", async (req, res) => {
  await Log("backend", "info", "api", "Health check requested");
  res.json({ status: "ok", service: "vehicle-maintenance-scheduler" });
});

/**
 * Generate maintenance schedule endpoint
 * GET /schedule
 */
app.get("/schedule", async (req, res) => {
  try {
    await Log("backend", "info", "api", "Schedule generation request received");

    const schedules = await generateSchedule(API_BASE_URL);

    await Log(
      "backend",
      "info",
      "api",
      "Schedule generation request completed successfully"
    );

    res.json({
      success: true,
      data: schedules,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    await Log(
      "backend",
      "error",
      "api",
      `Schedule generation request failed: ${error.message}`
    );

    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
});

/**
 * Catch-all for undefined routes
 */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Not Found",
    message: `Route ${req.method} ${req.path} does not exist`,
  });
});

/**
 * Error handler
 */
app.use(async (err, req, res, next) => {
  await Log(
    "backend",
    "error",
    "api",
    `Unhandled error: ${err.message}`
  );

  res.status(err.status || 500).json({
    success: false,
    error: err.message || "Internal Server Error",
  });
});

// Start server
const server = app.listen(PORT, async () => {
  await Log(
    "backend",
    "info",
    "service",
    `Vehicle Maintenance Scheduler server started on port ${PORT}`
  );
  console.log(`Server running on port ${PORT}`);
});

// Graceful shutdown
process.on("SIGTERM", async () => {
  await Log("backend", "info", "service", "SIGTERM received, shutting down");
  server.close(() => {
    console.log("Server closed");
    process.exit(0);
  });
});

module.exports = app;
