const mongoose = require("mongoose");

//models
const User = require("../models/user");

//creat new user
module.exports.createUser = async (req, res) => {
  try {
    const { username, email, password, role, specialization, phone } = req.body;
    //save user to db
    const newUser = await User.create({
      username,
      email,
      password,
      role,
      specialization,
      phone,
    });
    await newUser.save();
    res
      .status(201)
      .json({ message: "User created successfully", user: newUser });
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
    res.status(500).json({ message: "Error in fetching users", error: error.message });
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
        res.status(200).json({ message: "User deleted successfully", user: deletedUser });
    } catch (error) {
        res.status(500).json({ message: "Error in deleting user", error: error.message });
    }
}
