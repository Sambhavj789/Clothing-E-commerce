const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const connectToDB = require("./config/connectToDB");
const app = express();
connectToDB(); // Connect to db
app.get("/health", (req, res) => {
  res.send("Server Is Running Perfectly...");
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server Started! \nAccess At: http://localhost:${PORT}/health`);
});
