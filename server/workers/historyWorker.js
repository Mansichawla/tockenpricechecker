const { Worker } = require("bullmq");
const connection = require("../config/redis");
const { fetchFullPriceHistory } = require("../services/historyFetcher");

const worker = new Worker("price-history", async job => {
  const { token, network } = job.data;

  console.log(`⏳ Fetching full history for ${token} on ${network}`);

  try {
    // Step 1: Starting fetch
    await job.updateProgress(10);

    // Step 2: Fetching full history (this function may include multiple internal steps)
    await fetchFullPriceHistory(token, network, job);

    // Step 3: After successful fetch
    await job.updateProgress(100);
    
    console.log(`✅ Done for ${token}`);
  } catch (err) {
    console.error(`❌ Error while processing job ${job.id}`, err);
    throw err;
  }

}, {
  connection
});

worker.on("failed", (job, err) => {
  console.error(`❌ Job failed for ${job.id}`, err);
});
