const User = require("../models/userModel");

async function getCart(req, res) {
  const userId = req.user._id;
  const userData = await User.findById(userId).populate("cart.productId");
  return res.send({
    success: true,
    message: "Cart fetched successfully",
    data: userData.cart,
  });
}

async function addToCart(req, res) {
  const userId = req.user._id;
  const { productId, quantity, variant } = req.body;
  const userData = await User.findById(userId);
  const variantStr = JSON.stringify(variant || {});
  const existingIndex = userData.cart.findIndex(
    (item) =>
      item.productId.toString() === productId &&
      JSON.stringify(item.variant || {}) === variantStr,
  );
  if (existingIndex > -1) {
    userData.cart[existingIndex].quantity += quantity || 1;
  } else {
    userData.cart.push({ productId, quantity: quantity || 1, variant: variant || {} });
  }
  await userData.save();
  await userData.populate("cart.productId");
  return res.send({
    success: true,
    message: "Item added to cart",
    data: userData.cart,
  });
}

async function updateCartItem(req, res) {
  const userId = req.user._id;
  const { cartItemId, quantity } = req.body;
  const userData = await User.findById(userId);
  const item = userData.cart.id(cartItemId);
  if (!item) {
    return res.status(404).send({ success: false, message: "Item not found in cart" });
  }
  item.quantity = quantity;
  await userData.save();
  await userData.populate("cart.productId");
  return res.send({
    success: true,
    message: "Cart updated",
    data: userData.cart,
  });
}

async function removeFromCart(req, res) {
  const userId = req.user._id;
  const { cartItemId } = req.body;
  const userData = await User.findById(userId);
  userData.cart = userData.cart.filter(
    (item) => item._id.toString() !== cartItemId,
  );
  await userData.save();
  await userData.populate("cart.productId");
  return res.send({
    success: true,
    message: "Item removed from cart",
    data: userData.cart,
  });
}

module.exports = { getCart, addToCart, updateCartItem, removeFromCart };
