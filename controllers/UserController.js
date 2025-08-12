const User = require("../models/User");
const UserToken = require("../models/UserToken");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const { encryptDate, decryptDate } = require("../utils/cryptDate.js");

const jwtSecret = process.env.JWT_SECRET;

// Generate user token
const generateToken = (id) => {
  return jwt.sign({ id }, jwtSecret, { expiresIn: "7d" });
};

// Register user and sign in
const register = async (req, res) => {
  const { name, email } = req.body;
  const { usertoken } = req.headers;

  // check if user exists
  const user = await User.findOne({ email });

  if (user) {
    res.status(422).json({ errors: ["Por favor, utilize outro e-mail"] });
    return;
  }

  // Get User Token
  const userTokenBD = await UserToken.findOne({ email });

  if (!userTokenBD) {
    res
      .status(404)
      .json({ errors: ["O Token desse usuario não foi encontrado."] });
    return;
  }

  const isTokenMatch = await bcrypt.compare(usertoken, userTokenBD.tokenNum);

  if (!isTokenMatch) {
    res.status(401).json({ errors: ["Token de usuario inválido."] });
    return;
  }

  const userTokenDate = decryptDate(userTokenBD._id);

  if (!userTokenDate) {
    res.status(404).json({ errors: ["Token não encontrado."] });
    return;
  }

  if ((Date.now() - userTokenDate) >= 5 * 60 * 1000) {
    res.status(401).json({ errors: ["Token expirado."] });
    return;
  }
  await encryptDate(userTokenBD._id)

  // Create user
  const newUser = await User.create({
    name,
    email,
    lang: "pt-br",
    role: "user",
  });

  // If user was created successfully, return the token
  if (!newUser) {
    res
      .status(422)
      .json({ errors: ["Houve um erro, por favor tente mais tarde."] });
    return;
  }

  res.status(201).json({
    _id: newUser._id,
    token: generateToken(newUser._id),
  });
};

// Sign user in
const login = async (req, res) => {
  const { email } = req.body;
  const { usertoken } = req.headers;

  const user = await User.findOne({ email });

  // Check if user exists
  if (!user) {
    res.status(404).json({ errors: ["Usuário não encontrado."] });
    return;
  }

  if (user.authProvider == "google") {
    res.status(422).json({ errors: ["Esse e-mail já esta sendo utilizado com a autenticação do google."]})
    return;
  }

  // Get User Token
  const userTokenBD = await UserToken.findOne({ email });

  if (!userTokenBD) {
    res
      .status(404)
      .json({ errors: ["O Token desse usuario não foi encontrado."] });
    return;
  }

  const isTokenMatch = await bcrypt.compare(usertoken, userTokenBD.tokenNum);

  if (!isTokenMatch) {
    res.status(401).json({ errors: ["Token de usuario inválido."] });
    return;
  }

  const userTokenDate = await decryptDate(userTokenBD._id);

  if (!userTokenDate) {
    res.status(404).json({ errors: ["Token não encontrado."] });
    return;
  }

  if ((Date.now() - userTokenDate) >= 5 * 60 * 1000) {
    res.status(401).json({ errors: ["Token expirado."] });
    return;
  }

  await encryptDate(userTokenBD._id)

  res.status(201).json({
    _id: user._id,
    profileImage: user.profileImage,
    finishedLessons: user.finishedLessons,
    token: generateToken(user._id),
  });
};

// Get current logged in user
const getCurrentUser = async (req, res) => {
  const user = req.user;

  res.status(200).json(user);
};

// Update an user
const update = async (req, res) => {
  const { name, lang } = req.body;

  let profileImage = null;

  if (req.file) {
    profileImage = req.file.filename;
  }

  const reqUser = req.user;

  const user = await User.findById(new mongoose.Types.ObjectId(reqUser._id));

  if (name) {
    user.name = name;
  }

  if (profileImage) {
    user.profileImage = profileImage;
  }

  if (lang) {
    user.lang = lang;
  }

  await user.save();

  res.status(200).json(user);
};

// Get user by id
const getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(new mongoose.Types.ObjectId(id));

    // Check if user exists
    if (!user) {
      res.status(404).json({ errors: ["Usuário não encontrado."] });
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({ errors: ["Usuário não encontrado."] });
    return;
  }
};

// Add finished Lesson to an user
const addFinishedLesson = async (req, res) => {
  const { lessonId } = req.body;

  const reqUser = req.user;

  const user = await User.findById(
    new mongoose.Types.ObjectId(reqUser._id)
  ).select("-password");

  if (!user.finishedLessons.includes(lessonId)) {
    user.finishedLessons.push(lessonId);
    await user.save();
  }

  res.status(200).json({
    comment: lessonId,
    message: "The lesson was added successfully.",
  });
};

const resetLessons = async (req, res) => {
  const reqUser = req.user;

  const user = await User.findById(new mongoose.Types.ObjectId(reqUser._id));

  user.finishedLessons = [];
  await user.save();

  res.status(200).json(user);
};

const promoteToDev = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);
    if (!user)
      return res.status(404).json({ errors: ["Usuário não encontrado."] });

    user.role = "dev";
    await user.save();

    res.status(200).json({ message: "Usuário promovido a desenvolvedor." });
  } catch (error) {
    res.status(500).json({ errors: ["Erro ao promover usuário."] });
  }
};

module.exports = {
  register,
  login,
  getCurrentUser,
  update,
  getUserById,
  addFinishedLesson,
  resetLessons,
  promoteToDev,
};
