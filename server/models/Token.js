const mongoose = require("mongoose");

const tokenSchema = new mongoose.Schema({
  symbol: String,
  prices: [Number],
});

module.exports = mongoose.model("Token", tokenSchema);
