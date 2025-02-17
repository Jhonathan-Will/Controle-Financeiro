const jwt = require('jsonwebtoken')

function auth(req, res, next){
    const authToken = req.headers['authorization']
   
    if(authToken != undefined){
        const bearer = authToken.split(' ')

        let token = bearer[1]

        jwt.verify(token, process.env.SECRET, (error, data) => {
            if(error){
                res.status(401)
                res.json({eror: "Token invalido"})
            }else{
                req.token = token
                req.loggedUser = { id: data.id, email: data.email}
                next();
            }
        })
    }else{
        res.status(401)
        res.json({error : "Token invalido"})
    }
}


module.exports = auth