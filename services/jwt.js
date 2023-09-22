const jwt = require("jwt-simple");
const moment = require("moment");

//Secret key
const secret = "CLAVE_SECRETA_del_proyecto_Sun_Moon_APP_865389";

//Generate token
exports.createToken = (user) => {
    const payload = {
        id: user._id,
        name: user.name,
        email: user.email,
        iat: moment().unix(),
        exp: moment().add(30, "days").unix()
    }

    //Return codificated token
    return jwt.encode(payload, secret);
}

