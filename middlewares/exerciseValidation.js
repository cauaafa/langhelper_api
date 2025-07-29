const { body } = require("express-validator");

const exerciseCreateValidation = () => {
  return [
    body("type")
      .isString()
      .withMessage("O tipo é obrigatório.")
      .custom((value) => {
        if (value === "explanation" || value === "question") {
          return true;
        }
        throw new Error("O tipo deve ser explanation ou question.");
      }),
  ];
};

const exerciseUpdateValidation = () => {
  return [
    body("text")
      .optional()
      .isString()
      .withMessage("O texto precisa ser válido."),
    body("answerIndex")
      .optional()
      .isString()
      .withMessage("A resposta precisa ser válida.."),
  ];
};

module.exports = { exerciseCreateValidation, exerciseUpdateValidation };
