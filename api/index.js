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
    try {
        const { email, name, password } = req.body;

        if (!email) return res.status(400).json({ error: "Email é obrigatório" });
        if (!name) return res.status(400).json({ error: "Nome é obrigatório" });
        if (!password) return res.status(400).json({ error: "Senha é obrigatória" });

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) return res.status(409).json({ error: "Email já cadastrado" });

        const hashedPassword = await bcrypt.hash(password, 13);
        const newUser = await prisma.user.create({
            data: { email, name, password: hashedPassword }
        });

        res.status(201).json({ id: newUser.id, email: newUser.email, name: newUser.name });
        
    } catch (error) {
        console.error("Erro no cadastro:", error);
        res.status(500).json({ error: "Erro interno no servidor" });
    }
})

app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email) return res.status(400).json({ error: "Email é obrigatório" });
        if (!password) return res.status(400).json({ error: "Senha é obrigatória" });

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return res.status(404).json({ error: "Usuário não encontrado" });

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) return res.status(401).json({ error: "Credenciais inválidas" });

        const token = await new Promise((resolve, reject) => {
            jwt.sign(
                { id: user.id, email: user.email },
                process.env.SECRET,
                (error, token) => {
                    error ? reject(error) : resolve(token);
                }
            );
        });

        res.status(200).json({
            message: "Login realizado com sucesso",
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name
            }
        });

    } catch (error) {
        console.error("Erro no login:", error);
        
        // Tratamento específico para erro de autenticação JWT
        if (error.name === 'JsonWebTokenError') {
            return res.status(500).json({ error: "Falha na geração do token" });
        }

        res.status(500).json({ error: "Erro interno no servidor" });
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
