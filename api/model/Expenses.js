const { PrismaClient } = require('@prisma/client')//configurando o client do prisma para querys no banco
const prisma = new PrismaClient()

class Expenses{
    async create(user_id, name, local, amount, data, payment_end){
        try {
            let newExpense = await prisma.expenses.create({
                data: {
                    user_id,
                    name,
                    local,
                    amount,
                    data,
                    payment_end
                }
            })

            return newExpense
        } catch (error) {
            console.log("erro model expenses: "+ error);
            return undefined
        }
    }

    async findByUser(user_id){
        try {
            let expenses = await prisma.expenses.findMany({where: {user_id}})
            return expenses
        } catch (error) {
            console.log("erro model expenses: "+error)
            return undefined
        }
    }

    async delete(id){
        try {
            let expense = await prisma.expenses.delete({where: {id}})
            return expense
        } catch (error) {
            console.log("erro model expenses: "+error)
            return undefined
        }
    }

    async update(id, name, local, amount, data, payment_end){
        try {
            let expense = await prisma.expenses.update({
                where: {id},
                data: {
                    name,
                    local,
                    amount,
                    data,
                    payment_end
                }
            })

            return expense
        } catch (error) {
            console.log("erro model expenses: "+error)
            return undefined
        }
    }

}

module.exports = new Expenses()