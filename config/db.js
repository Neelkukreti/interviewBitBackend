const mongoose = require('mongoose');
const config = require('config');
const db= config.get("mongoURI"); 

const connectDB= async() => {
    try{
        mongoose.connect(db, {useNewUrlParser:true, useCreateIndex: true});
        console.log("db IS CONNECTED..");
    }
    catch(err) {
        console.log(err.message);
        process.exit(1);
    }
}

module.exports = connectDB;