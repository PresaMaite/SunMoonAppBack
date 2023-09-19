const mongoose = require("mongoose");

const connection = async() => {
    try {

        await mongoose.connect("mongodb://localhost:27017");
        console.log("Conectado a la base de datos :)");

    } catch (error) {

        console.log(error);
        throw new Error("Error al conectarse a la base de datos");
        
    }

}

module.exports = {
    connection
}
