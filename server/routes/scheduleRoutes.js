const express = require("express");
const { schedulePriceFetch } = require("../controllers/scheduleController");
const { getJobProgress } = require( '../controllers/scheduleController.js');
const router = express.Router();

router.post("/schedule", schedulePriceFetch);

router.get('/progress/:jobId', getJobProgress);

module.exports = router;
