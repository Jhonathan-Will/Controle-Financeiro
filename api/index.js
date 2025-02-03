require('dotenv').config()//configurando o dotenv

const express = require("express")//configuração do express
const app = express()

const bodyParser = require('body-parser')//chamando body-parse
const bcrypt = require('bcrypt')//chamando bcrypt
const jwt = require('jsonwebtoken')// chamando o jwt

const { PrismaClient } = require('@prisma/client')//configurando o client do prisma para querys no banco
const prisma = new PrismaClient()

app.use(bodyParser.urlencoded({extended: false}))//configurando o body-parser
app.use(bodyParser.json())

app.post("/client", async (req, res) => {
    let { email, name, password } = req.body
    
    if(email !== undefined && email  !== ""){

        let user = await prisma.user.findUnique({
            where: {
                email
            }
        })

        if(user){
            res.status(406).json({response: "este email já esta cadastrado no sistema"})
        }

        if(password != undefined && password != ""){
            if(name != undefined && name != ""){
                prisma.user.create({
                    data: {
                        email,
                        name,
                        password: await bcrypt.hash(password, 13)
                    }
                }).then(() => {
                    res.status(200)
                    res.json({response: "Usuario criado com sucesso"})
                }).catch(error => {
                    res.status(500)
                    res.json({response: error})
                })
            }else{
                res.status(401)
                res.json({response: "nome não pode se vazio"})
            }
        }else{
            res.status(401)
            res.json({response: "senha não pode ser vazio"})
        }
    }else{
        res.status(401)
        res.json({response: "email não pode ser vazio"})
    }
})

app.get("/login", async (req, res) => {
    let { email, password } = req.body

    if(email != undefined && email != ""){
        if(password != undefined && password != ""){
            let user

            try{
                 user = await prisma.user.findUnique({
                    where : {
                        email,
                    }
                })
            }catch(error ){
                 res.status(500)
                 res.json({response: error})
            }
            

            if(bcrypt.compareSync(password, user.password)){

                jwt.sign({id: user.id, email: user.email}, process.env.SECRET, (error, token) => {
                    if(error){
                        res.status(400).json({response: "falha ao gerar o token"})
                    }else{
                        res.status(200)
                        res.json({
                            response: "logado com sucesso",
                            token,
                        })
                    }
                })

            }else{
                res.status(406).json({response: "senha incorreta"})
            }
        }else{
            res.status(401)
            res.json({resonse: "a senha não pode ser vazia"})
        }
    }else{
        res.status(401)
        res.json({response: "o email não pode ser vazio"})
    }
})

app.listen(8080, (req, res) => {
    console.log("rodando")
})

function auth(req, res, next){
    const authToken = req.headers['authorization']
   
    if(authToken != undefined){
        const bearer = authToken.split(' ')

        let token = bearer[1]

        jwt.verify(token, process.env.SECRET, (error, data) => {
            if(error){
                res.status(401)
                res.json({eror: "Token invalido"})
            }else{
                req.token = token
                req.loggedUser = { id: data.id, email: data.email}
                console.log(data)
                next();
            }
        })
    }else{
        res.status(401)
        res.json({error : "Token invalido"})
    }
}
