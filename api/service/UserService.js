const User = require("../model/User")//chamando o model User
const jwt = require('jsonwebtoken')// chamando o jwt

class UserService{
    async create({ name, email, password, salary }){
        try {
            return await User.create(name, email, password, salary)
        } catch (error) {
            return undefined
        }
    }

    async login({ email, password}){
        const user = await User.findByEmail(email);

        if (!user) return {status: 404, message: "Usuário não encontrado"}

        const passwordMatch = await User.passwordMatch(password, user.password)
        if (!passwordMatch) return {status: 401, message: "Credenciais inválidas"} 

        const token = await new Promise((resolve, reject) => {
            jwt.sign(
                { id: user.id, email: user.email },
                process.env.SECRET,
                (error, token) => {
                    error ? reject(error) : resolve(token);
                }
            );
        });

        return {status: 200, message: {
            response: "Login realizado com sucesso",
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name
            },
            error: ""
        }} 

    } catch (error) {
        console.error("Erro no login:", error);
        
        // Tratamento específico para erro de autenticação JWT
        if (error.name === 'JsonWebTokenError') {
            return {status: 500, message: "Falha na geração do token"}
        }

        return {status: 500, message: "Falha interna nos serviços"}
    
    }
}

module.exports = new UserService()