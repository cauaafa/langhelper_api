const express = require("express");
const router = express.Router();

// Controller
const {
  createCourse,
  deleteCourse,
  getAllCourses,
  getCourseById,
  getCoursesByLang,
  updateCourse,
  updateUnit,
  deleteUnit,
  addUnitToCourse,
} = require("../controllers/CourseController");

// Middlewares
const {
  courseCreateValidation,
  courseUpdateValidation,
} = require("../middlewares/courseValidation");
const validate = require("../middlewares/handleValidation");
const authGuard = require("../middlewares/authGuard");
const devValidate = require("../middlewares/devValidation");

// Routes
router.post(
  "/create",
  authGuard,
  courseCreateValidation(),
  devValidate,
  validate,
  createCourse
);
router.delete("/:id", authGuard , devValidate, validate, deleteCourse);
router.get("/", authGuard, getAllCourses);
router.get("/lang/:lang", authGuard, getCoursesByLang);
router.get("/:id", authGuard, getCourseById);
router.put(
  "/:id",
  authGuard,
  courseUpdateValidation(),
  devValidate,
  validate,
  updateCourse
);
router.post(
  "/:id/unit",
  authGuard,
  devValidate,
  validate,
  addUnitToCourse
);

router.put(
  "/:id/unit/:unitId",
  authGuard,
  devValidate,
  validate,
  updateUnit
);

router.delete(
  "/:id/unit/:unitId",
  authGuard,
  devValidate,
  validate,
  deleteUnit
);

module.exports = router;
