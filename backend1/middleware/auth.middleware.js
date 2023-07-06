const jwt = require("jsonwebtoken")
require("dotenv").config()
const {BlacklistModel} = require("../model/blacklist.model")

const auth = async(req,res, next)=>{
    try {
        const accessToken = req.headers.authorization

        if(!accessToken) return res.status(400).json({message: "Please Login"})

        const isTokenBlacklisted = await BlacklistModel.findOne({
            token: accessToken
        })

        if(isTokenBlacklisted)
            return res.status(400).json({message: "Please Login"})

        jwt.verify(
            accessToken,
            process.env.JWT_SECRET,
            (err, payload) =>{
                if(err){
                    return res.status(401).json({err: err.message})
                } else{
                    req.userId = payload.userId
                    req.role = payload.role
                    next()
                }
            }
        )

    } catch (err) {
        console.log(err)
        return res.status(401).json({message: "Unauthorized", err: err.message})
    }
}

module.exports = { auth }