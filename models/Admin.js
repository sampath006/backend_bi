const mongoose = require("mongoose");

//This is Admin schema for backend.
//Here we defined the data types for the backend.

const AdminSchema = new mongoose.Schema({
    username:{
        type: String,
        required:true,
        unique:true
    },
    email:{
        type: String,
        required:true,
        unique:true
    },
    password:{
        type: String,
        required:true
    },
    profilePic:{
        type: String,
        default: ""
    },
},{timestamps:true});

module.exports = mongoose.model("Admin",AdminSchema);