const Expense = require("../service/ExpensesService")
class ExpensesController{
    async create(req, res){
        try {

            const expense = await Expense.create(req.loggedUser.id, req.body)

            if(!expense){res.status(400).json({response: "Erro ao criar despesa"})}

            res.status(201).json({response: "Despesa criada com sucesso",
                                  error: "",
                                  expense
            });
            
        } catch (error) {
            console.error("Erro no cadastro:", error);
            res.status(500).json({ error: "Erro interno no servidor" });
        }
    }
}

module.exports = new ExpensesController()