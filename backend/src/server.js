const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");
const connectToDB = require("./config/connectToDB");
const authRoutes = require("./routes/authRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const cookieParser = require("cookie-parser");

const app = express();
connectToDB(); // Connect to db

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.MODE == "development" ? true : process.env.FRONTEND_URL,
    credentials: true,
  }),
);

app.get("/health", (req, res) => {
  res.send("Server Is Running Perfectly...");
});

app.use("/api/v1/auth", authRoutes); // POST: http://localhost:4000/api/v1/auth/register
app.use("/api/v1/category", categoryRoutes); // GET: http://localhost:4000/api/v1/category

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server Started! \nAccess At: http://localhost:${PORT}/health`);
});
