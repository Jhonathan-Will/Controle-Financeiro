const ExpenseService = require("../service/ExpensesService")
class ExpensesController{
    async create(req, res){
        try {

            const expense = await ExpenseService.create(req.loggedUser.id, req.body)

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

    async getAll(req, res) {
        try {
            const response = await ExpenseService.getAll(req.loggedUser.id)

            if(response.status == 200) return res.status(201).json({response : response.message.response, data: response.message.expenses, error: response.message.error})
            if(response.status == 500) return res.status(500).json({response : response.message.response, error: response.message.error})
        } catch (error) {
            console.log("error: "+ error)
            res.status(500).json("error interno no servido")
        }
    }

    async getOne(req, res){
        try {
            const response = await ExpenseService.getOne(req.loggedUser.id, req.params.id)

            if(response.status = 200) return res.status(201).json({response : response.message.response, data: response.message.expenses, error: response.message.error})
            if(response.status == 500) return res.status(500).json({response : response.message.response, error: response.message.error})
        } catch (error) {
            console.log("error: "+ error)
            res.status(500).json("error interno no servido")
        }
    }


}

module.exports = new ExpensesController()