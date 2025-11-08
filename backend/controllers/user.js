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
