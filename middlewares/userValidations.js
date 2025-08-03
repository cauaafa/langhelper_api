const { body, header } = require("express-validator");

const userCreateValidation = () => {
  return [
    body("name")
      .isString()
      .withMessage("O nome é obrigatório.")
      .isLength({ min: 3 })
      .withMessage("O nome precisa ter no mínimo 3 caracteres."),
    body("email")
      .isString()
      .withMessage("O e-mail é obrigatório")
      .isEmail()
      .withMessage("Insira um e-mail válido."),
    header("userToken")
      .isNumeric()
      .withMessage("O token é obrigatório.")
      .isLength({ min: 6, max: 6 })
      .withMessage("O token precisa ter 6 caracteres."),
  ];
};

const loginValidation = () => {
  return [
    body("email")
      .isString()
      .withMessage("O e-mail é obrigatório.")
      .isEmail()
      .withMessage("Insira um e-mail válido"),
    header("userToken")
      .isNumeric()
      .withMessage("O token é obrigatória.")
      .isLength({ min: 6, max: 6 })
      .withMessage("O token precisa ter 6 caracteres."),
  ];
};

const userUpdateValidation = () => {
  return [
    body("name")
      .optional()
      .isLength({ min: 3 })
      .withMessage("O nome precisa ter no mínimo 3 caracteres."),
    body("lang")
      .optional()
      .isString()
      .withMessage("A linguagem precisa ser válida.")
  ];
};

const addLessonValidation = () => {
  return [body("lessonId").isString().withMessage("A lição é obrigatória.")];
};

module.exports = {
  userCreateValidation,
  loginValidation,
  userUpdateValidation,
  addLessonValidation,
};
