const { fetchPrice } = require("../services/priceFetcher");

exports.getPrice = async (req, res) => {
  try {
    const { token, network, timestamp } = req.query;

    if (!token || !network || !timestamp) {
      return res.status(400).json({ error: "Missing token, network, or timestamp" });
    }

    const data = await fetchPrice(token, network, timestamp);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
