// imports
const { connection } = require("./database/connection");
const express = require("express");
const cors = require("cors");

// DB connection
connection();

// server
const app = express();
const port = 3900;

// cors
app.use(cors());

// js objects 
app.use(express.json());
app.use(express.urlencoded({extended:true}));

// listener 
app.listen(port, () => {
    console.log(`port: ${port}`);
})
