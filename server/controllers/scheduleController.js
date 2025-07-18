const historyQueue = require("../queues/historyQueue");

exports.schedulePriceFetch = async (req, res) => {
  const { token, network } = req.body;

  if (!token || !network) {
    return res.status(400).json({ error: "Missing token or network" });
  }

  // Add job to BullMQ queue
  await historyQueue.add("fetch-history", {
    token,
    network
  });

  res.json({ message: "Fetch history scheduled successfully" });
};
