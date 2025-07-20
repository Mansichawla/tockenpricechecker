const express = require("express");
const { getPrice } = require("../controllers/priceController");
const { checkCache } = require("../middleware/cacheController");
const { checkInterpolation } = require("../middleware/interpolationController");

const router = express.Router();

// Route: GET /price?token=0x...&network=eth&timestamp=...
router.get("/price", 
    checkCache,           // 1. First try Redis cache
    checkInterpolation,   // 2. Then try interpolation if not cached
    getPrice              // 3. Finally fetch directly
);

module.exports = router;


