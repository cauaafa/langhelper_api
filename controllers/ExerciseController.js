const Lesson = require("../models/Lesson");

const mongoose = require("mongoose");

const createExercise = async (req, res) => {
  const { id } = req.params;
  const { type } = req.body;

  try {
    const lesson = await Lesson.findById(new mongoose.Types.ObjectId(id));

    if (!lesson) {
      res.status(404).json({ errors: ["Lição não encontrada."] });
      return;
    }

    if (type === "explanation") {
      answerIndex = null;
    }

    const exercise = {
      type,
      text: "",
      image: null,
      answerIndex: null,
      options: [],
    };

    lesson.exercises.push(exercise);

    await lesson.save();

    res.status(200).json(lesson);
  } catch (error) {
    res
      .status(422)
      .json({ errors: ["Houve um problema, tente novamente mais tarde."] });
    return;
  }
};

const updateExercise = async (req, res) => {
  const { id, exerciseId } = req.params;
  const { text, answerIndex } = req.body;

  let image = null;

  if (req.file) {
    image = req.file.filename;
  }

  try {
    const lesson = await Lesson.findById(new mongoose.Types.ObjectId(id));

    if (!lesson) {
      res.status(404).json({ errors: ["Lição não encontrada."] });
      return;
    }

    const exercise = lesson.exercises.id(exerciseId);
    if (!exercise)
      return res.status(404).json({ errors: ["Exercicio não encontrado."] });

    if (answerIndex) {
      exercise.answerIndex = answerIndex;
    }

    if (text) {
      exercise.text = text;
    }

    if (image) {
      exercise.image = image;
    }

    if (exercise.type === "explanation") {
      exercise.answerIndex = null;
      exercise.options = [];
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

const deleteExercise = async (req, res) => {
  const { id, exerciseId } = req.params;

  try {
    const lesson = await Lesson.findById(new mongoose.Types.ObjectId(id));

    if (!lesson) {
      res.status(404).json({ errors: ["Lição não encontrada."] });
      return;
    }

    const exercise = lesson.exercises.id(exerciseId);
    if (!exercise)
      return res.status(404).json({ errors: ["Exercicio não encontrado."] });

    lesson.exercises = lesson.exercises.filter((e) => e._id.toString() !== exerciseId);

    await lesson.save();

    res.status(200).json(lesson);
  } catch (error) {
    res
      .status(422)
      .json({ errors: ["Houve um problema, tente novamente mais tarde."] });
    return;
  }
};

module.exports = { createExercise, updateExercise, deleteExercise };
