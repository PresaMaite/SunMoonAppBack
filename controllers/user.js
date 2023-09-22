const User = require("./../models/user");
const bcrypt = require("bcrypt");
const jwt = require("./../services/jwt");

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
        .exec(async(error, user) => {
            if(error || !user) {
                return res.status(404).json({
                    status: "error",
                    message: "Error de conexión"
                })
            }

            const pwd = await bcrypt.compare(params.password, user.password);

            if(!pwd) {
                return res.status(400).json({
                    status: "error",
                    message: "Error en la contraseña"
                })
            }

            //Create token
            const token = jwt.createToken(user);

            return res.status(200).json({
                status: "success",
                message: "Logeado",
                user: {
                    id: user._id,
                    name: user.name,
                },
                token
            })
        })
}


const profile = (req, res) => {
    const id = req.params.id;

    User.findById(id)
        .select({password: 0, role: 0})
        .exec((error, userProfile) => {
            if(error || !userProfile) {
                return res.status(404).json({
                    status: "error",
                    message: "No se ha encontrado el usuario"
                })
            }

            return res.status(200).json({
                status: "success",
                message: "Perfil de usuario mostrado",
                user: userProfile
            })
        })
}

module.export = {
    register,
    login,
    profile
}
