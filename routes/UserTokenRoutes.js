const express = require("express");
const router = express.Router();

// Controllers
const { createUserToken } = require("../controllers/UserTokenController")

// Middlewares
const validate = require("../middlewares/handleValidation");
const { userTokenCreateValidation } = require("../middlewares/userTokenValidation");

router.post("/create", userTokenCreateValidation(), validate, createUserToken);

module.exports = router;
