const mongoose = require('mongoose');
require("dotenv").config();

mongoose.set('strictQuery', false);
const connectMongo = () => {
    mongoose.connect(process.env.DBuri, () => {
        console.log("Connected to mongo successfully");
    })
}

module.exports = connectMongo; 
