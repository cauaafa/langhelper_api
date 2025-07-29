const express = require("express");
const router = express.Router();

// Controller
const {
  createLesson,
  updateLesson,
  deleteLesson,
  getLesson,
} = require("../controllers/LessonController");

// Middlewares
const {
  lessonCreateValidation,
  lessonUpdateValidation,
} = require("../middlewares/lessonValidation");
const validate = require("../middlewares/handleValidation");
const devValidate = require("../middlewares/devValidation")
const authGuard = require("../middlewares/authGuard");

// Routes
router.post(
  "/create/:id/unit/:unitId",
  authGuard,
  lessonCreateValidation(),
  devValidate,
  validate,
  createLesson
);
router.put(
  "/:id",
  authGuard,
  lessonUpdateValidation(),
  devValidate,
  validate,
  updateLesson
);
router.delete(
  "/:courseId/unit/:unitId/lesson/:id",
  authGuard,
  devValidate,
  validate,
  deleteLesson
);
router.get("/:id", authGuard, validate, getLesson);

module.exports = router;
