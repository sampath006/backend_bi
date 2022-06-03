const router = require("express").Router();
const User = require("../models/User");
const Post = require("../models/Post");
const Comment = require("../models/Comment");

//CREATE Comment

router.post("/",async (req, res)=>{
    const newComment = new Comment(req.body);
    try{
        const savedComment = await newComment.save();
        res.status(200).json(savedComment);
    }catch(err){
        res.status(500).json(err);
    }
    
});

// Get comment

router.get("/:id", async (req,res)=>{
    try{
        const comment = await Comment.findById(req.params.id);
        res.status(200).json(comment);
    }catch(err){
        res.status(500).json(err);
    }
});

module.exports = router