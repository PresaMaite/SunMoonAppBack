const User = require("./../models/user");
const bcrypt = require("bcrypt");

const register = (req, res) => {
    let params = req.body;

    if(!params.name || !params.email || !params.password) {

        return res.status(400).json({
            status: "error",
            message: "Datos incompletos"
        })
    }

    // User validation
    User.find({ $or: [
        {name: params.name.toLowerCase},
        {email: params.email.toLowerCase}
    ]}).exec(async(error, users) => {

        if(error){
            return res.status(500).json({
                status:"error", 
                message: "Ha ocurrido un error"
            })
        }

        if(users && users.length >= 1) {
            return res.status(200).json({
                status:"success", 
                message: "El usuario ya existe"
            })
        }

        // Password 
        let pwd = await bcrypt.hash(params.password, 10);
        params.password = pwd;

        // User object
        let user_registered = new User(params);

        //Save the user
        user_registered.save((error, userSaved) => {
            if(error || !userSaved) {

                return res.status(500).json({
                    status: "error",
                    message: "El usuario no se ha gurdado"
                })

            } else {

                // Response
                return res.status(200).json({
                    status: "success",
                    message: "Todo correcto",
                    user: userSaved
                })
            }
        })

    })
}


const login = (req, res) => {
    let params = req.body;

    User.findOne({email: params.email})
    .select({"password":0})
    .exec(async(error, user) => {
        if(error || !user) {
            return res.status(404).json({
                status: "error",
                message: "Error de conexión"
            })
        }

        return res.status(200).json({
            status: "success",
            message: "Logeado",
            user
        })
    })
}

module.export = {
    register,
    login
}
