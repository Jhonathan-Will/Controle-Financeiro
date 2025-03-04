const express = require('express')
const router = express.Router()

const UserController = require('../controller/UserController')//chamando o constroller do usuário
const ExpensesController = require('../controller/ExpensesController')//chamando o controller de despesas
const Auth = require('../middleware/Auth')//chamando o middleware de autenticação
const { RegisterValidate, LoginValidate } = require("../middleware/UserMiddleware")//chamando  middleware do usuario
const { CreateValidate } = require("../middleware/ExpenseMiddleware")//chamando middleware das despesas

//Usuário
router.post("/client", RegisterValidate, UserController.create)
router.post("/login", LoginValidate, UserController.login)

//Despesas
router.post("/expenses", Auth, CreateValidate, ExpensesController.create)
router.get("/expenses", Auth, ExpensesController.getAll)
router.get("/expenses/:id", Auth, ExpensesController.getONe)
module.exports = router