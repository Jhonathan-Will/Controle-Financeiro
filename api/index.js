require('dotenv').config()//configurando o dotenv

const express = require("express")//configuração do express
const app = express()

const router = require('./routes/routes')//chamando o arquivo de rotas

const bodyParser = require('body-parser')//chamando body-parse

app.use(bodyParser.urlencoded({extended: false}))//configurando o body-parser
app.use(bodyParser.json())

app.use("/", router)//usando as rotas

app.listen(8080, (req, res) => {
    console.log("rodando")
})
