
const jwt = require('jsonwebtoken')// chamando o jwt
const User = require('../model/User')//chamando o model User

class UserController{

    //criar usuáio
    async create(req, res){
        try {
            const { email, name, password } = req.body;
    
            if (!email) return res.status(400).json({ error: "Email é obrigatório" });
            if (!name) return res.status(400).json({ error: "Nome é obrigatório" });
            if (!password) return res.status(400).json({ error: "Senha é obrigatória" });

            const user = await User.create(email, name, password)


            if(!user){res.status(400).json({response: "Usuário já cadastrado"})}
    
            res.status(201).json({response: "Usuário cadastrado com sucesso",
                                user: {
                                    email: user.email, name: user.name 
                                }
            });
            
        } catch (error) {
            console.error("Erro no cadastro:", error);
            res.status(500).json({ error: "Erro interno no servidor" });
        }
    }
    //login de usuário
    async login(req, res){
        try {
            const { email, password } = req.body;
    
            if (!email) return res.status(400).json({ error: "Email é obrigatório" });
            if (!password) return res.status(400).json({ error: "Senha é obrigatória" });
    
            const user = await User.findByEmail(email);

            if (!user) return res.status(404).json({ error: "Usuário não encontrado" });
    
            const passwordMatch = await User.passwordMatch(password, user.password)
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
                response: "Login realizado com sucesso",
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
    }


}

module.exports = new UserController()