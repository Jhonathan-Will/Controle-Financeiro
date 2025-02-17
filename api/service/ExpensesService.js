const Expenses = require('../model/Expenses')

class ExpensesService{
    async create(user_id, { name, local, amount, data, payment_end}){
        try {
            return await Expenses.create(user_id, name, local, amount, new Date(data), new Date(payment_end))
        } catch (error) {
            return undefined;
        }
    } 
}

module.exports = new ExpensesService()