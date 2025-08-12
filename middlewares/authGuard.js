const User = require("../models/User");
const UserToken = require("../models/UserToken");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs")
const jwtSecret = process.env.JWT_SECRET;

const { decryptDate, encryptDate } = require("../utils/cryptDate")

const authGuard = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  const { usertoken: authUserToken } = req.headers;

  // Check if header has a token
  if (!token) return res.status(401).json({ errors: ["Acesso negado"] });

  try {
    const verified = jwt.verify(token, jwtSecret);

    req.user = await User.findById(verified.id).select();

    if (!req.user) return res.status(404).json({ errors: ["Usuário não encontrado."] });

    if (req.user.authProvider === "google") {
      return next();
    }

    const userToken = await UserToken.findOne({ email: req.user.email });

    const isTokenMatch = await bcrypt.compare(authUserToken, userToken.tokenNum)

    if (!isTokenMatch) {
      res.status(401).json({ errors: ["Token expirado."] });
      return;
    }

    const userTokenDate = await decryptDate(userToken._id);

    if (!userTokenDate) {
      res.status(404).json({ errors: ["Token não encontrado."] });
      return;
    }

    if (Date.now() - userTokenDate >= 4 * 60 * 60 * 1000) {
      res.status(401).json({ errors: ["Token expirado."] });
      return;
    }

    encryptDate(userToken._id)

    next();
  } catch (error) {
    console.log(error)
    res.status(401).json({ errors: ["Token expirado."] });
  }
};

module.exports = authGuard;
