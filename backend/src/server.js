const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const app = express();
app.get("/health", (req, res) => {
  res.send("Server Is Running Perfectly...");
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server Started! \nAccess At: http://localhost:${PORT}/health`);
});
