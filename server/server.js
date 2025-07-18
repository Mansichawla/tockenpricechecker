require("dotenv").config();
const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("./config/db");
const redisClient = require("./config/redis");
const priceRoutes = require("./routes/priceRoutes");
const cors = require("cors");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/price", priceRoutes);
// app.get('/price', async (req, res) => {
//   // token, network, timestamp ko query se lo
//   const { token, network, timestamp } = req.query;
  
//   // test ke liye ek dummy response bhej do
//   return res.json({
//     price: 123.45,
//     source: "dummy"
//   });
// });

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


