const Lesson = require("../models/Lesson");
const Course = require("../models/Course");

const mongoose = require("mongoose");

const createLesson = async (req, res) => {
  const { id, unitId } = req.params;
  const { name } = req.body;

  try {
    const course = await Course.findById(id);
    if (!course)
      return res.status(404).json({ errors: ["Curso não encontrado."] });

    const unit = course.units.id(unitId);
    if (!unit)
      return res.status(404).json({ errors: ["Unidade não encontrada."] });

    const newLesson = await Lesson.create({
      name,
      exercises: [],
    });

    // If course was create successfully, returns data
    if (!newLesson) {
      res
        .status(422)
        .json({ errors: ["Houve um problema, tente novamente mais tarde."] });
      return;
    }

    unit.lessons.push(newLesson._id.toString());
    await course.save();

    res.status(201).json(newLesson);
  } catch (error) {
    res
      .status(422)
      .json({ errors: ["Houve um problema, tente novamente mais tarde."] });
    return;
  }
};

const updateLesson = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  try {
    const lesson = await Lesson.findById(id);

    if (!lesson) {
      res.status(404).json({ errors: ["Lição não encontrada."] });
      return;
    }

    if (name) {
      lesson.name = name;
    }

    await lesson.save();

    res.status(200).json(lesson);
  } catch (error) {
    res
      .status(422)
      .json({ errors: ["Houve um problema, tente novamente mais tarde."] });
    return;
  }
};

const deleteLesson = async (req, res) => {
  const { courseId, unitId, id } = req.params;

  try {
    const lesson = await Lesson.findById(new mongoose.Types.ObjectId(id));

    if (!lesson) {
      res.status(404).json({ errors: ["Lição não encontrada."] });
      return;
    }

    const course = await Course.findById(new mongoose.Types.ObjectId(courseId));
    if (!course) {
      res.status(404).json({ errors: ["Curso não encontrado."] });
      return;
    }

    const unit = await course.units.id(unitId);
    if (!unit) {
      res.status(404).json({ errors: ["Unidade não encontrada."] });
      return;
    }

    if (!unit.lessons.some((l) => l === id)) {
      res.status(404).json({ errors: ["Lição não encontrada."] });
      return;
    }

    unit.lessons = unit.lessons.filter((l) => l !== id);

    await course.save();

    await Lesson.findByIdAndDelete(new mongoose.Types.ObjectId(id));

    res.status(200).json({ message: "Lição deletada com sucesso." });
  } catch (error) {
    res
      .status(422)
      .json({ errors: ["Houve um problema, tente novamente mais tarde."] });
    return;
  }
};

const getLesson = async (req, res) => {
  const { id } = req.params;

  try {
    const lesson = await Lesson.findById(new mongoose.Types.ObjectId(id));

    if (!lesson) {
      res.status(404).json({ errors: ["Lição não encontrada."] });
      return;
    }

    res.status(200).json(lesson);
  } catch (error) {
    res
      .status(422)
      .json({ errors: ["Houve um problema, tente novamente mais tarde."] });
    return;
  }
};

module.exports = {
  createLesson,
  updateLesson,
  deleteLesson,
  getLesson,
};
