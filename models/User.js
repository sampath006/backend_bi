const mongoose = require("mongoose");

//This is User schema for backend.
//Here we defined the data types for the backend.

const UserSchema = new mongoose.Schema({
    username:{
        type: String,
        required:[true,"Username is Required"],
        unique:true
    },
    email:{
        type: String,
        required:[true,"Email is Required"],
        unique:true
    },
    password:{
        type: String,
        required:[true,"Password is Required"]
    },
    profilePic:{
        type: String,
        default: ""
    },
},{timestamps:true});

module.exports = mongoose.model("User",UserSchema);