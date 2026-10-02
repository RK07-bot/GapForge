const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firebaseUid: {
      type: String,
      unique: [true, "user already exists"],
      required: true,
    },
    email: {
      type: String,
      unique: [true, "email already exists"],
      required: true,
    },
    displayName: {
      type: String,
      required: true,
    },
    photoURL: {
      type: String,
    },
  },
  { timestamps: true },
);

const userModel = mongoose.model("users", userSchema);
module.exports = userModel;