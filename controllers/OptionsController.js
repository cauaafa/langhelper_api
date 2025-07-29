const Lesson = require("../models/Lesson");

const mongoose = require("mongoose");

const createOption = async (req, res) => {
  const { lessonId, exerciseId } = req.params;

  try {
    const lesson = await Lesson.findById(new mongoose.Types.ObjectId(lessonId));

    if (!lesson) {
      res.status(404).json({ errors: ["Lição não encontrada."] });
      return;
    }

    const exercise = lesson.exercises.id(exerciseId);
    if (!exercise)
      return res.status(404).json({ errors: ["Exercicio não encontrado."] });

    const newOption = {
      text: null,
      image: null,
    };

    exercise.options.push(newOption);

    await lesson.save();

    res.status(200).json(lesson);
  } catch (error) {
    res
      .status(422)
      .json({ errors: ["Houve um problema, tente novamente mais tarde."] });
    return;
  }
};

const setAnswer = async (req, res) => {
  const { lessonId, exerciseId, optionId } = req.params;

  try {
    const lesson = await Lesson.findById(new mongoose.Types.ObjectId(lessonId));

    if (!lesson) {
      res.status(404).json({ errors: ["Lição não encontrada."] });
      return;
    }

    const exercise = lesson.exercises.id(exerciseId);
    if (!exercise)
      return res.status(404).json({ errors: ["Exercicio não encontrado."] });

    const option = exercise.options.id(optionId);
    if (!option)
      return res.status(404).json({ errors: ["Exercicio não encontrado."] });

    exercise.answerIndex = option._id.toString();

    await lesson.save();

    res.status(200).json(lesson);
  } catch (error) {
    res
      .status(422)
      .json({ errors: ["Houve um problema, tente novamente mais tarde."] });
    return;
  }
};

const updateOption = async (req, res) => {
  const { lessonId, exerciseId, optionId } = req.params;
  const { text } = req.body;

  let image = null;

  if (req.file) {
    image = req.file.filename;
  }

  try {
    const lesson = await Lesson.findById(new mongoose.Types.ObjectId(lessonId));

    if (!lesson) {
      res.status(404).json({ errors: ["Lição não encontrada."] });
      return;
    }

    const exercise = lesson.exercises.id(exerciseId);
    if (!exercise)
      return res.status(404).json({ errors: ["Exercicio não encontrado."] });

    const option = exercise.options.id(optionId);
    if (!option)
      return res.status(404).json({ errors: ["Exercicio não encontrado."] });

    if (text) {
      option.text = text;
    }

    if (image) {
      option.image = image;
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

const deleteOption = async (req, res) => {
  const { lessonId, exerciseId, optionId } = req.params;

  try {
    const lesson = await Lesson.findById(new mongoose.Types.ObjectId(lessonId));

    if (!lesson) {
      res.status(404).json({ errors: ["Lição não encontrada."] });
      return;
    }

    const exercise = lesson.exercises.id(exerciseId);
    if (!exercise)
      return res.status(404).json({ errors: ["Exercicio não encontrado."] });

    const option = exercise.options.id(optionId);
    if (!option)
      return res.status(404).json({ errors: ["Exercicio não encontrado."] });

    exercise.options = exercise.options.filter(
      (o) => o._id.toString() !== optionId
    );

    await lesson.save();

    res.status(200).json(lesson);
  } catch (error) {
    res
      .status(422)
      .json({ errors: ["Houve um problema, tente novamente mais tarde."] });
    return;
  }
};

module.exports = { createOption, setAnswer, updateOption, deleteOption };
