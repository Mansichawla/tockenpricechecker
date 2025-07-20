const redisClient = require("../config/redis");

exports.checkCache = async (req, res, next) => {
  const { token, network, timestamp } = req.query;
  const key = `${token}-${network}-${timestamp}`;

  try {
    const cached = await redisClient.get(key);
    if (cached) {
      return res.json({ source: "cache", ...JSON.parse(cached) });
    }
    next();
  } catch (err) {
    console.error("Redis cache error:", err.message);
    next(); // Don't block request
  }
};
