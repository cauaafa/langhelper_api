const { body } = require("express-validator");

const optionUpdateValidation = () => {
  return [
    body("text")
      .optional()
      .isString()
      .withMessage("O texto precisa ser válido.")
  ];
};

module.exports = { optionUpdateValidation };
