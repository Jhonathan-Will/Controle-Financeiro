const joi = require("joi")

const ExpenseSchema =  {
   create: joi.object({
            name: joi.string().required(),
            local: joi.string().required(),
            amount: joi.number().required(),
            data: joi.date().required(),
            payment_end: joi.date().required()
            })
}

const validate = (schema) => async(req, res, next) => {
    try{
        await schema.validateAsync(req.body)
        next();
    }catch(error){
        console.log("Erro de  validação", error)
        res.status(400).json({response: "",  error})
    }
}

module.exports = {
    CreateValidate : validate(ExpenseSchema.create)
}