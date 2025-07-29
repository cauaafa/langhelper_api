const { body } = require("express-validator");

const lessonCreateValidation = () => {
  return [
    body("name")
      .not()
      .equals("undefined")
      .withMessage("O nome é obrigatório.")
      .isString()
      .withMessage("O nome é obrigatório."),
    body("units").optional()
  ];
};

const lessonUpdateValidation = () => {
  return [
    body("name").optional().isString().withMessage("O nome é obrigatório."),
  ];
};

module.exports = { lessonCreateValidation, lessonUpdateValidation}