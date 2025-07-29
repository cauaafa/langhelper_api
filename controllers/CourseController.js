const Course = require("../models/Course");
const Lesson = require("../models/Lesson");

const mongoose = require("mongoose");

// Create a course
const createCourse = async (req, res) => {
  const { name, lang } = req.body;

  const newCourse = await Course.create({
    name,
    lang,
    units: [],
  });

  // If course was create successfully, returns data
  if (!newCourse) {
    res
      .status(422)
      .json({ errors: ["Houve um problema, tente novamente mais tarde."] });
    return;
  }

  res.status(201).json(newCourse);
};

// Remove a course from DB
const deleteCourse = async (req, res) => {
  const { id } = req.params;

  try {
    const course = await Course.findById(new mongoose.Types.ObjectId(id));

    //Check if photo exists
    if (!course) {
      res.status(404).json({ errors: ["Curso não encontrado."] });
      return;
    }

    for (const u of course.units) {
      for (const l of u.lessons) {
        try {
          await Lesson.findByIdAndDelete(new mongoose.Types.ObjectId(l));
        } catch (err) {
          console.log(err);
        }
      }
    }

    await Course.findByIdAndDelete(course._id);

    res
      .status(200)
      .json({ id: course._id, message: "Curso excluído com sucesso." });
  } catch (error) {
    console.log(error);
    res.status(404).json({ errors: ["Curso não encontrado."] });
    return;
  }
};

// Get all courses
const getAllCourses = async (req, res) => {
  const courses = await Course.find({})
    .sort([["createdAt", -1]])
    .exec();

  return res.status(200).json(courses);
};

const getCoursesByLang = async (req, res) => {
  const { lang } = req.params;

  const courses = await Course.find({ lang })
    .sort([["createdAt", -1]])
    .exec();

  return res.status(200).json(courses);
};

// Get course by id
const getCourseById = async (req, res) => {
  const { id } = req.params;

  try {
    const course = await Course.findById(new mongoose.Types.ObjectId(id));

    //Check if photo exists
    if (!course) {
      res.status(404).json({ errors: ["Curso não encontrado."] });
      return;
    }

    res.status(200).json(course);
  } catch (error) {
    res
      .status(422)
      .json({ errors: ["Um erro aconteceu, tente novamente mais tarde."] });
    return;
  }
};

// update a course
const updateCourse = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  try {
    const course = await Course.findById(id);

    // Check if course exists
    if (!course) {
      res.status(404).json({ errors: ["Curso não encontrado."] });
      return;
    }

    if (name) {
      course.name = name;
    }

    await course.save();
    res.status(200).json(course);
  } catch (error) {
    res
      .status(422)
      .json({ errors: ["Um erro aconteceu, tente novamente mais tarde."] });
    return;
  }
};

const addUnitToCourse = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  try {
    const course = await Course.findById(id);

    if (!course) {
      return res.status(404).json({ errors: ["Curso não encontrado."] });
    }

    const newUnit = {
      _id: new mongoose.Types.ObjectId(),
      name,
      lessons: [],
    };

    course.units.push(newUnit);
    await course.save();

    return res
      .status(201)
      .json({ message: "Unidade criada com sucesso.", unit: newUnit });
  } catch (error) {
    return res.status(500).json({ errors: ["Erro ao adicionar unidade."] });
  }
};

const updateUnit = async (req, res) => {
  const { id, unitId } = req.params;
  const { name } = req.body;

  try {
    const course = await Course.findById(id);

    if (!course)
      return res.status(404).json({ errors: ["Curso não encontrado."] });

    const unit = course.units.id(unitId);
    if (!unit)
      return res.status(404).json({ errors: ["Unidade não encontrada."] });

    if (name) {
      unit.name = name;
    }

    await course.save();

    return res
      .status(200)
      .json({ message: "Unidade atualizada com sucesso.", unit });
  } catch (error) {
    return res.status(500).json({ errors: ["Erro ao atualizar unidade."] });
  }
};

const deleteUnit = async (req, res) => {
  const { id, unitId } = req.params;

  try {
    const course = await Course.findById(id);
    if (!course)
      return res.status(404).json({ errors: ["Curso não encontrado."] });

    const unit = course.units.id(unitId);
    if (!unit)
      return res.status(404).json({ errors: ["Unidade não encontrada."] });

    course.units = course.units.filter((u) => u._id.toString() !== unitId);

    await course.save();

    return res.status(200).json({ message: "Unidade removida com sucesso." });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ errors: ["Erro ao remover unidade."] });
  }
};

module.exports = {
  createCourse,
  deleteCourse,
  getAllCourses,
  getCourseById,
  getCoursesByLang,
  updateCourse,
  addUnitToCourse,
  updateUnit,
  deleteUnit,
};
