const { PrismaClient } = require('@prisma/client')//configurando o client do prisma para querys no banco
const prisma = new PrismaClient()
const bcrypt = require('bcrypt')//chamando bcrypt

//querys do banco de dados para o usuário
class User{
    //criar usuário no banco de dados
    async create(email, name, password){
        try {
            let user = await this.findByEmail(email)

            if(user){
               let newUser = await prisma.user.create({
                    data: {
                        email,
                        name,
                        password: bcrypt.hashSync(password, 13)
                    }
                })

                return newUser
            }else{
                console.log("Usuário já cadastrado")
                return undefined
            }
        } catch (error) {
            console.log(error)

            return undefined
        }

    }

    //buscar usuário por email no banco de dados
    async findByEmail(email){       
        try {
            let user = await prisma.user.findUnique({ where: {email}})
            return user
        } catch (error) {
            console.log(error)
            return false
        }
    }

    //comparar senha do login com o do banco de dados
    async passwordMatch(password, passwordHash){
        return await bcrypt.compare(password, passwordHash)
    }
}

module.exports = new User()