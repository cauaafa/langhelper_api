const mongoose = require("mongoose");
const { Schema } = mongoose;

const userTokenSchema = new Schema(
  {
    email: String,
    tokenNum: String,
    updatedAtEncrypted: String,
    iv: String,
  }
);

const UserToken = mongoose.model("userToken", userTokenSchema);

module.exports = UserToken;
