const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcrypt = require("bcrypt");
const validate = require("validator");

const userSchema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["patient", "doctor", "admin"],
    default: "patient",
    required: true,
  },
  // only for doctors
  specialization: {
    type: String,
    default: null,
  },
  phone: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

//static function to login user
userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email });
  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      return user;
    }
    throw new Error("Incorrect password");
  }
  throw new Error("User not found");
};

//static funtion for user register
userSchema.statics.register = async function (
  username,
  email,
  password,
  role,
  specialization,
  phone
) {
  //check if user already exists
  const existingUser = await this.findOne({ email });
  if (existingUser) {
    throw new Error("User already exists");
  }
  //salt and hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  //validate the password and email
  if (!validate.isEmail(email)) {
    throw new Error("Invalid email");
  }
  if (!validate.isStrongPassword(password)) {
    throw new Error(
      "Password is not strong enough. It should be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character."
    );
  }
  //register new user
  const newUser = new this({
    username,
    email,
    password: hashedPassword,
    role,
    specialization,
    phone,
  });
  await newUser.save();
  return newUser;
};


module.exports = mongoose.model("User", userSchema);
