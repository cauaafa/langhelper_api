const express = require("express");
const router = express.Router();

const passport = require("../config/passport");

// Controller
const {
  register,
  login,
  getCurrentUser,
  update,
  getUserById,
  addFinishedLesson,
  resetLessons,
  promoteToDev,
  googleLogin,
} = require("../controllers/UserController");
const {
  userCreateValidation,
  loginValidation,
  userUpdateValidation,
  addLessonValidation,
} = require("../middlewares/userValidations");

// Middlewares
const validate = require("../middlewares/handleValidation");
const authGuard = require("../middlewares/authGuard");
const devValidate = require("../middlewares/devValidation")
const { imageUpload } = require("../middlewares/imageUpload");

// Routes
router.post("/register", userCreateValidation(), validate, register);
router.post("/login", loginValidation(), validate, login);

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get("/google/callback", passport.authenticate("google", { session: false }),
  (req, res) => {
    const { token, user } = req.user;
    res.json({
      _id: user._id,
      profileImage: user.profileImage,
      name: user.name,
      token,
      provider: "google"
    });
  }
);

router.get("/profile", authGuard, getCurrentUser);
router.put(
  "/",
  authGuard,
  userUpdateValidation(),
  validate,
  imageUpload.single("profileImage"),
  update
);
router.get("/:id", getUserById);
router.put(
  "/addlesson",
  authGuard,
  addLessonValidation(),
  validate,
  addFinishedLesson
);
router.put(
  "/promote/:id",
  authGuard,
  devValidate,
  promoteToDev
);

router.delete("/resetlessons", authGuard, resetLessons);

module.exports = router;
