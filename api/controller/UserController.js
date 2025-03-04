const UserService = require('../service/UserService')//chamando o service User

class UserController{

    //criar usuáio
    async create(req, res){
        try {
            
            const user = await UserService.create(req.body)

            if(!user){res.status(400).json({response: "Usuário já cadastrado"})}
    
            res.status(201).json({response: "Usuário cadastrado com sucesso",
                                error : "",
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
            let response = await UserService.login(req.body)

            return res.status(response.status).json(response.message)
        } catch (error) {
            console.log("Aconteceu um erro: ", error)

            return  res.status(500).json({response: "", error: "Erro interno do serviço"})
        }
    }


}

module.exports = new UserController()