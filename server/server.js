require("dotenv").config();
const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("./config/db");
const redisClient = require("./config/redis");
const priceRoutes = require("./routes/priceRoutes");
const scheduleRoutes = require("./routes/scheduleRoutes");
const cors = require("cors");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/", priceRoutes);
app.use("/",scheduleRoutes);


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


