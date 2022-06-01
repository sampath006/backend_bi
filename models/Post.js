const mongoose = require("mongoose");

//This is Posts schema for backend.
//Here we defined the data types for the backend.

const PostSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        unique:true
    },
    desc:{
        type:String,
        required:true,
    },
    photo:{
        type:String,
        required:false
    },
    username:{
        type:String,
        required:true,
    },
    userid:{
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: 'User'
    },
    categories:{
        type:Array,
        required:false
    },
    comment:[{type: mongoose.Schema.Types.ObjectId,required: false, ref: 'Comment'}],
    like: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}]
},{timestamps:true});

module.exports = mongoose.model("Post",PostSchema);