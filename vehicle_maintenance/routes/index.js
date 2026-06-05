const express = require("express");
const { health, schedule } = require("../controllers/scheduleController");
const { notFound } = require("../middleware/errorHandler");

const router = express.Router();

router.get("/health", health);
router.get("/schedule", schedule);
router.use(notFound);

module.exports = { router };
