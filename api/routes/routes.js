const express = require('express')
const router = express.Router()

const UserController = require('../controller/UserController')//chamando o constroller do usuário
const ExpensesController = require('../controller/ExpensesController')//chamando o controller de despesas
const Auth = require('../middleware/Auth')//chamando o middleware de autenticação

//Usuário
router.post("/client", UserController.create)
router.post("/login", UserController.login)

//Despesas
router.post("/expenses", Auth, ExpensesController.create)
module.exports = router