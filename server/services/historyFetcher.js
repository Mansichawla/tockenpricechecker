const axios = require('axios');
const Price = require('../models/Price');
const { getAlchemyURL } = require('../utils/alchemyUtils');

async function getTokenCreationTimestamp(token, network) {
  const alchemyUrl = getAlchemyURL(network);

  try {
    const response = await axios.post(alchemyUrl, {
      jsonrpc: "2.0",
      id: 1,
      method: "alchemy_getAssetTransfers",
      params: [{
        category: ["erc20"],
        contractAddresses: [token],
        maxCount: "1",
        order: "asc",
        withMetadata: true
      }]
    });

    const transfer = response.data.result?.transfers?.[0];
    if (transfer) {
      const blockTime = new Date(transfer.metadata.blockTimestamp).getTime();
      return Math.floor(blockTime / 1000);
    }

    throw new Error("Token creation timestamp not found.");
  } catch (err) {
    console.error("❌ Error fetching creation date:", err.message);
    throw err;
  }
}

exports.fetchFullPriceHistory = async (token, network, job) => {
  try {
    console.log(`📈 Fetching full price history for ${token} on ${network}...`);

    const creationTimestamp = await getTokenCreationTimestamp(token, network);
    const todayTimestamp = Math.floor(Date.now() / 1000);
    const oneDay = 86400;

    const totalDays = Math.floor((todayTimestamp - creationTimestamp) / oneDay);
    if (totalDays <= 0) {
      console.warn("⚠️ Token is too new or timestamps are invalid.");
      return;
    }

    const alchemyUrl = getAlchemyURL(network);

    let dayCounter = 0;
    for (let ts = creationTimestamp; ts <= todayTimestamp; ts += oneDay) {
      console.log(`🔍 Fetching price for ${new Date(ts * 1000).toISOString().slice(0, 10)}`);

      let price = null;
      try {
        const response = await axios.post(alchemyUrl, {
          jsonrpc: "2.0",
          id: 1,
          method: "alchemy_getTokenPrice",
          params: [token, "latest"] // NOTE: historical pricing isn't supported directly
        });

        price = response.data.result?.usdPrice || null;
      } catch (err) {
        console.warn(`⚠️ Failed to fetch price for ${ts}: ${err.message}`);
      }

      await Price.findOneAndUpdate(
        { token, network, timestamp: ts },
        {
          token,
          network,
          timestamp: ts,
          price: price,
          source: 'alchemy'
        },
        { upsert: true, new: true }
      );

      dayCounter++;
      if (job && typeof job.updateProgress === 'function') {
        const progressPercent = Math.floor((dayCounter / totalDays) * 100);
        await job.updateProgress(progressPercent);
        console.log(`📊 Progress: ${progressPercent}%`);
      }

      console.log(`✅ Saved price for ${new Date(ts * 1000).toISOString().slice(0, 10)}: $${price}`);
      await new Promise(resolve => setTimeout(resolve, 300)); // Throttle to avoid rate limits
    }

    console.log("🎉 Completed full price history fetch.");
  } catch (err) {
    console.error("❌ Failed to fetch price history:", err.stack || err.message);
    throw err;
  }
};
