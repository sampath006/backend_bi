const mongoose = require("mongoose");

//This is Category schema for backend.
//Here we defined the data types for the backend.

const CategorySchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
},{timestamps:true});

module.exports = mongoose.model("Category",CategorySchema);