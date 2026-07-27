const express = require("express");
const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
} = require("../controllers/cartControllers");
const asyncHandler = require("../utils/asyncHandler");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/", asyncHandler(authMiddleware), asyncHandler(getCart));
router.post("/add", asyncHandler(authMiddleware), asyncHandler(addToCart));
router.put("/update", asyncHandler(authMiddleware), asyncHandler(updateCartItem));
router.delete("/remove", asyncHandler(authMiddleware), asyncHandler(removeFromCart));

module.exports = router;
