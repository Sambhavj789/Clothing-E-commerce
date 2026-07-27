const express = require("express");
const {
  register,
  login,
  getMe,
  logout,
  updateProfile,
} = require("../controllers/authControllers");
const asyncHandler = require("../utils/asyncHandler");
const authMiddleware = require("../middlewares/authMiddleware");
const upload = require("../utils/upload");

const router = express.Router();

router.post("/register", asyncHandler(register));

router.post("/login", asyncHandler(login));

router.get("/me", asyncHandler(authMiddleware), asyncHandler(getMe));

router.get("/logout", asyncHandler(logout));

router.put("/update", asyncHandler(authMiddleware), upload.single("profilePic"), asyncHandler(updateProfile));

module.exports = router;
