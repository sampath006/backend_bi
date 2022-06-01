const router = require("express").Router();
const User = require("../models/User");
const Post = require("../models/Post");
const bcrypt = require("bcrypt");
const { Mongoose } = require("mongoose");
const jwt = require('jsonwebtoken')
const asynHandler = require('express-async-handler')
require('dotenv')


function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.sendStatus(401)
  
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      console.log(err)
      if (err) return res.sendStatus(403)
      req.user = user
      next()
    })
  }

//UPDATE User

router.put("/:id",authenticateToken,async (req,res)=>{
        try{
            const updateUser = await  User.findByIdAndUpdate(req.params.id,{
                $set: req.body,
            },{new:true});
            res.status(200).json(updateUser);
        } catch(err){
            res.status(500).json(err);
        }

});

 
//DELETE User

router.delete("/:id",authenticateToken,async (req,res)=>{
    if(req.user._id === req.params.id){
        try{
            const user = await User.findById(req.params.id);
            try{
                await Post.deleteMany({username:user.username})
                await User.findByIdAndDelete(req.params.id)
                res.status(200).json("User has been deleted ...");
            } catch(err){
                res.status(500).json(err);
            }
        }catch(err){
            res.status(404).json("User not found!");
        }
    }
    else{
        res.status(401).json("You can delete only your accout!");
    }
    
});

//GET USER

router.get("/:id", async (req,res)=>{
    try{
        const user = await User.findById(req.params.id);
        const {password, ...others} = user._doc;
        res.status(200).json(others);
    }catch(err){
        res.status(500).json(err)
    }
})

// Get all users
router.get("/",async (req,res)=>{
    try {
        const users = await User.find();
        res.status(200).json(users);
        
    } catch (err) {
        res.status(500).json(err);
    }

})

module.exports = router