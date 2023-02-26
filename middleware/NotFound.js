const NotFoundError = require("../errors/NotFoundError")

module.exports = (req,res) =>{
     throw new NotFoundError(`${req.method} - ${req.url} doesn't exists`)
}