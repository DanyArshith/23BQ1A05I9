const { createSchedule } = require("../services/schedulerService");
const { log } = require("../middleware/logger");

async function health(req, res) {
  res.status(200).json({ status: "ok" });
}

async function schedule(req, res) {
  try {
    res.status(200).json(await createSchedule());
  } catch (error) {
    await log("error", "handler", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
}

module.exports = { health, schedule };
