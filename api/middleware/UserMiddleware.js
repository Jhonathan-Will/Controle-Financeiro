const joi = require("joi")

const userSchema = {
    register: joi.object({
        name: joi.string().required(),
        email: joi.string().required(),
        password: joi.string().required(),
        salary: joi.number().allow(null)
    }),
    login: joi.object({
        email: joi.string().required(),
        password: joi.string().required()
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
    RegisterValidate : validate(userSchema.register),
    LoginValidate: validate(userSchema.login)
}