const jwt = require("jwt-simple");
const moment = require("moment");

//Import secret key
const jwtService = require("./../services/jwt");
const secret = jwtService.secret;

//Auth function
exports.auth = (req, res, next) => {
    if(!req.headers.authorization) {
        return res.status(403).json({
            status: "error",
            message: "Falta la cabecera de autenticación"
        })
    }


    let token = req.headers.authorization.replace(/['"]+/g, '')

    try {
        let payload = jwt.decode(token, secret);

        if(payload.exp <= moment().unix()) {
            return res.status(401).json({
                status: "error",
                message: "El token ha caducado"
            })
        }

        req.user = payload;
        
    } catch (error) {
        return send.status(404).json({
            status: "error",
            message: "Error token",
            error
        })
    }


    next();
}

