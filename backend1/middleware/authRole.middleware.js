const { BlogModel } = require("../model/blog.model")

const authRole = async (req, res, next) => {
    const userRole = req.role
    const userId = req.userId
    const {id} = req.params

    if(userRole === "Moderator"){
        next()
    } else {
        const blog = await BlogModel.findById(id)
        if(blog.userId === userId){
            next()
        } else {
            return res.status(401).send({msg:"Unauthorized!!!!"})
        }
    }
}

module.exports = { authRole }