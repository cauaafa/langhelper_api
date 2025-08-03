const { body } = require("express-validator");

const userTokenCreateValidation = () => {
  return [
    body("email")
      .isString()
      .withMessage("O e-mail é obrigatório")
      .isEmail()
      .withMessage("Insira um e-mail válido.")
  ];
};

module.exports = {
  userTokenCreateValidation,
};
