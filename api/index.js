const express = require("express")//configuração do express
const app = express()

const bodyParser = require('body-parser')//chamando body-parse

const PrismaClient = require('@prisma/client')//configurando o client do prisma para querys no banco
const prisma = new PrismaClient()

app.use(bodyParser.urlencoded({extended: false}))//configurando o body-parser
app.use(bodyParser.json())

app.listen(8080, (req, res) => {
    console.log("rodando")
})