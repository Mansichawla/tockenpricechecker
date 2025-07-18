const { Worker } = require("bullmq");
const connection = require("../config/redis");
const { fetchFullPriceHistory } = require("../services/historyFetcher");

const worker = new Worker("price-history", async job => {
  const { token, network } = job.data;

  console.log(`⏳ Fetching full history for ${token} on ${network}`);
  await fetchFullPriceHistory(token, network);
  console.log(`✅ Done for ${token}`);
}, {
  connection
});

worker.on("failed", (job, err) => {
  console.error(`❌ Job failed for ${job.id}`, err);
});
