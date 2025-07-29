const { body } = require("express-validator");

const courseCreateValidation = () => {
  return [
    body("name")
      .not()
      .equals("undefined")
      .withMessage("O nome é obrigatório.")
      .isString()
      .withMessage("O nome é obrigatório."),
    body("lang")
      .not()
      .equals("undefined")
      .withMessage("A linguagem do curso é obrigatória.")
      .isString()
      .withMessage("A linguagem do curso é obrigatória."),
    body("units").optional().isArray().withMessage("Units deve ser uma lista."),
  ];
};

const courseUpdateValidation = () => {
  return [
    body("name").optional().isString().withMessage("O nome é obrigatório."),
  ];
};

module.exports = { courseCreateValidation, courseUpdateValidation };
