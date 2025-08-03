const UserToken = require("../models/UserToken");
const bcrypt = require("bcryptjs");
const sgMailAPI = require("@sendgrid/mail");

const sgMail = process.env.SENDGRID_API_EMAIL;
sgMailAPI.setApiKey(process.env.SENDGRID_API_KEY);

const { encryptDate } = require("../utils/cryptDate")

const createUserToken = async (req, res) => {
  console.log(req.body);

  const { email } = req.body;

  const tokenNum = Math.floor(100000 + Math.random() * 900000).toString();
  const salt = await bcrypt.genSalt();
  const hashedToken = await bcrypt.hash(tokenNum, salt);

  try {
    let userToken = await UserToken.findOne({ email });

    if (userToken) {
      userToken.tokenNum = hashedToken;
      await userToken.save();
    } else {
      userToken = await UserToken.create({
        email,
        tokenNum: hashedToken,
      });
    }

    await encryptDate(userToken._id);

    const msg = {
      to: email,
      from: sgMail,
      subject: "Seu token do LangHelper",
      text: "O seu token do LangHelper está aqui.",
      html: `<hr style="border-color: blue;" /> <h2>Utilize esse token: <span stlye="font-weight:bold; font-size:36px;">${tokenNum}</span> </h2> <h3>Ele ira expirar em 5 minutos.</h3> <hr style="border-color: blue;"/>`,
    };

    await sgMailAPI.send(msg).catch((error) => {
      console.error("Erro ao enviar e-mail:", error);
    });

    return res.status(201).json({
      _id: userToken._id,
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ errors: ["Houve um erro interno do servidor."] });
  }
};

module.exports = { createUserToken };
