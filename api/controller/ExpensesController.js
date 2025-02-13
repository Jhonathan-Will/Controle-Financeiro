const Expenses = require('../model/Expenses')

class ExpensesController{
    async create(req, res){
        try {
            const { user_id, name, local, amount, data, payment_end } = req.body;

            if (!user_id) return res.status(400).json({ error: "Id do usuário é obrigatório" });
            if (!name) return res.status(400).json({ error: "Nome é obrigatório" });
            if (!local) return res.status(400).json({ error: "Local é obrigatório" });
            if (!amount) return res.status(400).json({ error: "Valor é obrigatório" });
            if (!data) return res.status(400).json({ error: "Data é obrigatória" });
            if (!payment_end) return res.status(400).json({ error: "Data de pagamento é obrigatória" });

            const expense = await Expenses.create(user_id, name, local, amount, data, payment_end)

            if(!expense){res.status(400).json({response: "Erro ao criar despesa"})}

            res.status(201).json({response: "Despesa criada com sucesso",
                                expense: {
                                    user_id: expense.user_id, name: expense.name, local: expense.local, amount: expense.amount, data: expense.data, payment_end: expense.payment_end
                                }
            });
            
        } catch (error) {
            console.error("Erro no cadastro:", error);
            res.status(500).json({ error: "Erro interno no servidor" });
        }
    }
}

module.exports = new ExpensesController()