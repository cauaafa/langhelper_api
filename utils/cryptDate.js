const UserToken = require("../models/UserToken");

const crypto = require("crypto");
const mongoose = require("mongoose");

const algorithm = "aes-256-cbc";
const key = crypto.scryptSync(
  process.env.CRYPT_PASS,
  process.env.CRYPT_SALT,
  32
);

const encryptDate = async (tokenId) => {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, key, iv); 

  console.log()

  try {
    const userToken = await UserToken.findById(
      new mongoose.Types.ObjectId(tokenId)
    );

    if (!userToken) {
      return null;
    }

    const encrypted = Buffer.concat([
      cipher.update(Date.now().toString(), "utf8"),
      cipher.final(),
    ]);

    userToken.updatedAtEncrypted = encrypted.toString("hex");
    userToken.iv = iv.toString("hex");

    await userToken.save();

    return {
      iv: iv.toString("hex"),
      content: encrypted.toString("hex"),
    };
  } catch (error) {
    console.log(error)
    return null;
  }
};

const decryptDate = async (tokenId) => {
  try {
    const userToken = await UserToken.findById(
      new mongoose.Types.ObjectId(tokenId)
    );

    if (!userToken) {
      return null;
    }

    const decipher = crypto.createDecipheriv(
      algorithm,
      key,
      Buffer.from(userToken.iv, "hex")
    );

    const decrypted = await Buffer.concat([
      decipher.update(Buffer.from(userToken.updatedAtEncrypted, "hex")),
      decipher.final(),
    ]);

    return new Date(parseInt(decrypted.toString("utf8")));
  } catch (error) {
    console.log(error);
    return null;
  }
};

module.exports = { encryptDate, decryptDate };
