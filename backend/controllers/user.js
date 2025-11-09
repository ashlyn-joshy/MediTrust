const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

//models
const User = require("../models/user");

//create token
const createToken = (id) => {
  return jwt.sign({ id, isUser: true }, process.env.JWT_SECRET, {
    expiresIn: "3d",
  });
};

//creat new user
module.exports.createUser = async (req, res) => {
  try {
    const { username, email, password, role, specialization, phone } = req.body;
    const newUser = await User.register(
      username,
      email,
      password,
      role,
      specialization,
      phone
    );
    const token = createToken(newUser._id);
    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: 3 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      message: "User created successfully",
      user: newUser,
      token: token,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error in creating user", error: error.message });
  }
};

//get all users
module.exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({ users });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error in fetching users", error: error.message });
  }
};

//delete user
module.exports.deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res
      .status(200)
      .json({ message: "User deleted successfully", user: deletedUser });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error in deleting user", error: error.message });
  }
};

//update user information
module.exports.updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const updateUser = await User.findByIdAndUpdate(userId, req.body);
    res
      .status(200)
      .json({ message: "User updated successfully", user: updateUser });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error in updating user", error: error.message });
  }
};
