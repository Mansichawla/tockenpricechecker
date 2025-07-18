const express = require("express");
const { getPrice } = require("../controllers/priceController");
const router = express.Router();

router.get("/price", getPrice);

module.exports = router;

