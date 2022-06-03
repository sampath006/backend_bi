const mongoose = require('mongoose');
const { stringify } = require('yamljs');
const User = require('./User');

const commentSchema = new mongoose.Schema({
    author: {
        type: String,
        required: true,
    },
    userid: {type: mongoose.Schema.Types.ObjectId, required: true,ref: 'User'},
    test: {
        type: String,
        required: true,
    },
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Post'
    }
    
})
module.exports = mongoose.model("Comment",commentSchema);