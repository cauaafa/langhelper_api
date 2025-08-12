const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    name: String,
    email: String,
    profileImage: String,
    lang: String,
    googleId: String,
    authProvider: { type: String, enum: ["local", "google"], default: "local" },
    role: {
      type: String,
      enum: ["user", "dev"],
      default: "user",
    },
    finishedLessons: [String],
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
