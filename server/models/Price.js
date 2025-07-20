const mongoose = require("mongoose");

const priceSchema = new mongoose.Schema({
  token: String,
  network: String,
  timestamp: Number,
  price: Number
});

module.exports = mongoose.model("Price", priceSchema);
