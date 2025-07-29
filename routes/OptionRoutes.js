const express = require("express");
const router = express.Router();

// Controllers
const { createOption, setAnswer, updateOption, deleteOption } = require("../controllers/OptionsController");

// Middlewares
const { optionUpdateValidation } = require("../middlewares/optionValidation");
const validate = require("../middlewares/handleValidation");
const authGuard = require("../middlewares/authGuard");
const devValidate = require("../middlewares/devValidation")
const { imageUpload } = require("../middlewares/imageUpload");

// Routes
router.post(
  "/:lessonId/exercise/:exerciseId",
  authGuard,
  devValidate,
  validate,
  createOption
);

router.put(
  "/answer/:lessonId/exercise/:exerciseId/option/:optionId",
  authGuard,
  devValidate,
  validate,
  setAnswer
);

router.put(
  "/:lessonId/exercise/:exerciseId/option/:optionId",
  authGuard,
  optionUpdateValidation(),
  devValidate,
  validate,
  imageUpload.single("image"),
  updateOption
);

router.delete(
  "/:lessonId/exercise/:exerciseId/option/:optionId",
  authGuard,
  devValidate,
  validate,
  deleteOption
);

module.exports = router