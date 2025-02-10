const express = require('express')
const router = express.Router()

const UserController = require('../controller/UserController')//chamando o constroller do usuário

//Usuário
router.post("/client", UserController.create)
router.post("/login", UserController.login)
module.exports = router