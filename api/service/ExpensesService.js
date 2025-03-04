const Expenses = require('../model/Expenses')

class ExpensesService{
    async create(user_id, { name, local, amount, data, payment_end}){
        try {
            return await Expenses.create(user_id, name, local, amount, new Date(data), new Date(payment_end))
        } catch (error) {
            return undefined;
        }
    } 

    async getAll(user_id){
        try {
            let expenses = await Expenses.getAll(user_id) 

            if(expenses){
                return {status: 200, message: {
                    response: "esse cliente tem despesas",
                    expenses,
                    error: ""
                }}
            }
        } catch (error) {
            console.log("Error: "+error);
            return {status: 500, message: {
                response: "",
                error
            }}
        }
    }

    async getOne(user_id, id_expenses){
        try {
            let expense = await Expenses.getOne(user_id, id_expenses)

            if(expense){
                return { status: 200, message: {
                    response: "Despesa do cliente",
                    expense,
                    error: ""
                }}
            }
        } catch (error) {
            console.log("Error: "+error);
            return {status: 500, message: {
                response: "",
                error
            }}
        }
    }
}

module.exports = new ExpensesService()