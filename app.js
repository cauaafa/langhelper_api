// aqui é o Cauã - utilizei de um tutorial de React.JS q eu tenho, ele tem uma seção que usa MongoDB
// ainda não sei usar Node.JS, então copiei do projeto fazendo adaptações

require("dotenv").config()

const express = require("express");
const path = require("path");
const cors = require("cors");

const port = process.env.PORT;

const app = express();

// config JSON and form data
app.use(express.json())
app.use(express.urlencoded({extended: false}))

// Solve CORS
app.use(cors())

// Upload directory
app.use("/uploads", express.static(path.join(__dirname, "/uploads")))

// DB connection
require("./config/db.js")

// routes
const router = require("./routes/Router")

app.use(router)

app.listen(port, () => {
    console.log(`App rodando na porta ${port}`)
})

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ errors: ["Erro interno do servidor."] });
});
