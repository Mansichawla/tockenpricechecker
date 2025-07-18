const { Queue } = require("bullmq");
const connection = require("../config/redis");

const historyQueue = new Queue("price-history", {
  connection
});

module.exports = historyQueue;
