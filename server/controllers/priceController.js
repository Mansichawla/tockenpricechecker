const axios = require("axios");
const redisClient = require("../config/redis");
const Price = require("../models/Price");

exports.getPrice = async (req, res) => {
  const { token, network, timestamp } = req.query;

  if (!token || !network || !timestamp) {
    return res.status(400).json({ error: "Missing required query parameters." });
  }

  try {
    // Simulate price fetch from Alchemy or other API
    const fetchedPrice = await fetchFromAlchemy(token, network, timestamp);

    // Save to MongoDB
    await Price.create({
      token,
      network,
      timestamp: parseInt(timestamp),
      price: fetchedPrice
    });

    // Save to Redis cache
    const key = `${token}-${network}-${timestamp}`;
    await redisClient.set(key, JSON.stringify({
      token,
      network,
      timestamp,
      price: fetchedPrice
    }));

    return res.json({
      source: "alchemy",
      token,
      network,
      timestamp,
      price: fetchedPrice
    });

  } catch (err) {
    console.error("Fetch price error:", err.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Mock Alchemy fetcher
const fetchFromAlchemy = async (token, network, timestamp) => {
  // Simulate price using dummy logic for now
  const basePrice = Math.random() * 100;
  return parseFloat((basePrice + parseInt(timestamp) % 100).toFixed(2));
};
