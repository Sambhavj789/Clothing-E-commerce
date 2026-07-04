const express = require("express");
const {
  register,
  login,
  getMe,
  logout,
} = require("../controllers/authControllers");
const asyncHandler = require("../utils/asyncHandler");
const router = express.Router();

router.post("/register", asyncHandler(register));

router.post("/login", asyncHandler(login));

router.get("/me", asyncHandler(getMe));

router.get("/logout", asyncHandler(logout));

module.exports = router;
