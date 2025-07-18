const express = require("express");
const { schedulePriceFetch } = require("../controllers/scheduleController");
const router = express.Router();

router.post("/schedule", schedulePriceFetch);

module.exports = router;
