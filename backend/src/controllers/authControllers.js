const User = require("../models/userModel");
const bcrypt = require("bcrypt");

async function register(req, res) {
  const data = req.body;
  const { name, email, password, address, contactNumber } = data;
  if (!name || !email || !password || !address || !contactNumber) {
    return res
      .status(400)
      .send({ success: false, message: "Required Fields are missing" });
  }
  // Checking if email is already registered in db
  const userData = await User.findOne({ email: email });
  if (userData) {
    return res
      .status(400)
      .send({ success: false, message: "Email Already Registered" });
  }
  const hashPassword = await bcrypt.hash(password, 10);
  const newUserData = new User({
    name,
    email,
    address,
    contactNumber,
    password: hashPassword,
  });
  const newUser = await newUserData.save();
  return res.send({
    success: true,
    message: "Registered Successfully",
    data: newUser,
  });
}

async function login(req, res) {}

async function getMe(req, res) {}

async function logout(req, res) {}

module.exports = { register, login, getMe, logout };
