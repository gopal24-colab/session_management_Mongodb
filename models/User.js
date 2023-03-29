const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "User name can't be empty"],
    min: 3,
    max: 20,
  },
  email: {
    type: String,
    required: [true, "Email can't be empty"],
    max: 50,
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Password can't be empty"],
    min: 8,
  },
});

module.exports = mongoose.model("Users", userSchema);
