const Price = require("../models/Price");

exports.checkInterpolation = async (req, res, next) => {
  const { token, network, timestamp } = req.query;
  const ts = parseInt(timestamp);

  try {
    const prevPrice = await Price.findOne({ token, network, timestamp: { $lt: ts } }).sort({ timestamp: -1 });
    const nextPrice = await Price.findOne({ token, network, timestamp: { $gt: ts } }).sort({ timestamp: 1 });

    if (prevPrice && nextPrice) {
      const interpolatedPrice = prevPricePrice.price + ((nextPrice.price - prevPrice.price) * ((ts - prevPrice.timestamp) / (nextPrice.timestamp - prevPrice.timestamp)));
      return res.json({
        source: "interpolated",
        price: interpolatedPrice,
        timestamp,
        token,
        network
      });
    }

    next(); // Not enough data to interpolate
  } catch (err) {
    console.error("Interpolation error:", err.message);
    next(); // Continue to final fetch
  }
};
