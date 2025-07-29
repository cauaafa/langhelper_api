const { body } = require("express-validator");
const User = require("../models/User")
const mongoose = require("mongoose")

const devValidate = async (req, res, next) => {
  const reqUser = req.user;
  try {
    const user = await User.findById(
      new mongoose.Types.ObjectId(reqUser._id)
    ).select("-password");

    if (user.role != "dev") {
      return res.status(401).json({ errors: ["Usuário não autorizado."] });
    }

    return next();
  } catch (error) {
      return res.status(422).json({ errors: ["Um erro ocorreu, tente novamente mais tarde."] });
  }
};

module.exports = devValidate;
