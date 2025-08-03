const express = require("express");
const router = express();

router.use("/api/users", require("./UserRoutes"))
router.use("/api/courses", require("./CourseRoutes"))
router.use("/api/lessons", require("./LessonRoutes"))
router.use("/api/exercises", require("./ExerciseRoutes"))
router.use("/api/options", require("./OptionRoutes"))
router.use("/api/tokens", require("./UserTokenRoutes"))

// test router
router.get("/", (req, res) => {
  res.send("API working!");
});

module.exports = router;
