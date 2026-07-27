const Order = require("../models/ordersModel");

async function getAllOrders(req, res) {
  const allOrders = await Order.find({}).populate([
    { path: "userId" },
    { path: "items.productId" },
  ]);
  
  return res.send({
    success: true,
    message: "Success",
    data: allOrders,
  });
}

async function getUserOrders(req, res) {
  const userData = req.user;
  const userId = userData._id;
  const userOrders = await Order.find({ userId: userId }).populate("items.productId");
  return res.send({
    success: true,
    message: "Success",
    data: userOrders,
  });
}

async function createOrder(req, res) {
  const userData = req.user;
  const userId = userData._id;
  const data = req.body;
  const {
    items,
    shippingAddress,
    contactNumber,
    alternateNumber,
    totalOrderValue,
    payementMode,
    paymentStatus,
  } = data;

  if (!shippingAddress || !contactNumber || !items?.length) {
    return res.status(400).send({ success: false, message: "Shipping address, contact number, and items are required" });
  }

  const newOrder = new Order({
    userId,
    items,
    shippingAddress,
    contactNumber,
    alternateNumber: alternateNumber || "",
    totalOrderValue,
    payementMode: payementMode || "COD",
    paymentStatus: paymentStatus || "pending",
    deliveredAt: null,
  });
  const newOrderData = await newOrder.save();

  const User = require("../models/userModel");
  await User.findByIdAndUpdate(userId, { $set: { cart: [] } });

  return res.send({
    success: true,
    message: "Order Placed Successfully",
    data: newOrderData,
  });
}

async function updateOrder(req, res) {
  const data = req.body;
  const { orderId, status } = data;
  let deliveredAt = null;
  if (status == "delivered") {
    deliveredAt = Date.now();
  }
  const updatedOrderData = await Order.findByIdAndUpdate(orderId, {
    orderStatus: status,
    deliveredAt,
  });
  return res.send({
    success: true,
    message: "Order Status Updated",
    data: updatedOrderData,
  });
}

module.exports = {
  getAllOrders,
  getUserOrders,
  createOrder,
  updateOrder,
};
