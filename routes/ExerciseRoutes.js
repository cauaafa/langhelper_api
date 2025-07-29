const express = require("express");
const router = express.Router();

// Controllers
const {
  createExercise,
  updateExercise,
  deleteExercise,
} = require("../controllers/ExerciseController");

// Middlewares
const {
  exerciseUpdateValidation,
  exerciseCreateValidation,
} = require("../middlewares/exerciseValidation");
const validate = require("../middlewares/handleValidation");
const authGuard = require("../middlewares/authGuard");
const devValidate = require("../middlewares/devValidation")
const { imageUpload } = require("../middlewares/imageUpload");

// Routes
router.post(
  "/:id",
  authGuard,
  exerciseCreateValidation(),
  devValidate,
  validate,
  createExercise
);
router.put(
  "/:id/exercise/:exerciseId",
  authGuard,
  exerciseUpdateValidation(),
  devValidate,
  validate,
  imageUpload.single("image"),
  updateExercise
);
router.delete(
  "/:id/exercise/:exerciseId",
  authGuard,
  devValidate,
  validate,
  deleteExercise
);

module.exports = router;
