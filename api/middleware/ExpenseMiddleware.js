const joi = require("joi")

const schema =  joi.object({
    name: joi.string().required(),
    local: joi.string().required(),
    amount: joi.number().required(),
    data: joi.date().required(),
    payment_end: joi.date().required()
})

module.exports = async (req, res, next) => {
    try{
        await schema.validateAsync(req.body)
        next()
    }catch(error){
        console.error("Erro na validação", error)
        res.status(400).json({response: "", error})
    }
}