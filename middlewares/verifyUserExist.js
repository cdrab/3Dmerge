const {users} = require("../database/models")

const verifyUserExist = async(req, res, next) => {
    const {email} = await req.body

    if(!email) return res.json("Pas de email")

    const user = await users.findOne({where:{
        email: email,
    }})

    if(!user) return res.json("Utilisateur n'existe pas")

    req.user = user

    next()
}

module.exports = verifyUserExist