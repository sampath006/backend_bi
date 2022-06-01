const mongoose = require("mongoose")
const User = require('./User');
const Category = require('./Category')

//This is Events schema for backend.
//Here we defined the data types for the backend.

const EventSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        required:true
    },
    photo:{
        type:String,
        required:false
    },
    desc:{
        type:String,
        required:true
    },
    prize:{
        type:String,
        required:false
    },
    username:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref: 'User',
    },

    categories:{
        type:mongoose.Schema.Types.ObjectId,
        required:false,
        ref: 'Category'
    },
    venue:{
        type:String,
        required:true
    },
    
},{timestamps:true});

module.exports = mongoose.model("Event",EventSchema);