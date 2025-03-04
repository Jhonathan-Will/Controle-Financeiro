const { PrismaClient } = require('@prisma/client')//configurando o client do prisma para querys no banco
const prisma = new PrismaClient()
const bcrypt = require('bcrypt')//chamando bcrypt

//querys do banco de dados para o usuário
class User{
    //criar usuário no banco de dados
    async create(name, email, password, salary){
        try {
            let user = await this.findByEmail(email)

            if(!user){
               let newUser = await prisma.user.create({
                    data: {
                        name,
                        email,
                        password: bcrypt.hashSync(password, 13),
                        salary: parseFloat(salary)
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
        console.log(email)    
        try {
            let user = await prisma.user.findUnique({ where: {email}})
            return user
        } catch (error) {
            console.log(error)
            return undefined
        }
    }

    //comparar senha do login com o do banco de dados
    async passwordMatch(password, passwordHash){
        return await bcrypt.compare(password, passwordHash)
    }
}

module.exports = new User()