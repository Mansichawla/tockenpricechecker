const axios = require("axios");

exports.fetchPrice = async (token, network, timestamp) => {
  const url = `https://api.alchemy.com/price/${token}?network=${network}&timestamp=${timestamp}&key=${process.env.ALCHEMY_API_KEY}`;
  
  const res = await axios.get(url);

  return {
    price: res.data.price,
    source: res.data.source || "alchemy"  // Or determine based on logic
  };
};
