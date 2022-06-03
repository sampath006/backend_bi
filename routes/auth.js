const router = require("express").Router();
const User = require("../models/User");
const Admin = require("../models/Admin");
const Post = require("../models/Post");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken')
const asynHandler = require('express-async-handler')
require('dotenv')

// USer REGISTER
let refreshTokens = []
router.post("/register",async (req,res)=>{

    try{
        console.log(req.body)
        if (!req.body.username || !req.body.email || !req.body.password){
            res.status(400)
            throw new Error('Please enter all details')
        }
        // console.log(req.body.username)
        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(req.body.password, salt);
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPass
        })

        const user = await newUser.save();
        res.status(200).json(user);
    } catch(err){
        res.status(500).json(err);
    }
});

//User Login

// router.post("/login", async (req,res)=>{
//     try{
//         const user = await User.findOne({username:req.body.username})
//         //!user && res.status(400).json("Wrong Credentials!!!"))
//         if (!user){
//             return res.status(400).json("Wrong Credentials!!!")
//         }
//         const validate = await bcrypt.compare(req.body.password,user.password)
//         // !validate && res.status(400).json("Wrong Credentials!!!")
//         if (!validate){
//             return res.status(400).json("Wrong Credentials!!!")
//         }
//         const {password, ...others} = user._doc;
//         res.status(200).json(others);
//         // return
//     } catch(err){
//         res.status(500).json(err);
//     }
// });

router.post("/token",async (req,res)=>{
    try{
        const refreshToken = req.body.token;
        if (refreshToken == null){return res.status(401)}
        if (!refreshTokens.includes(refreshToken)){return res.status(403)}
        jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET,(err,user)=>{
            if (err) return res.status(500).json(err)
            const accessToken = generateAuthenticationToken({name: user.name,username:user.name,_id: user._id})
            return res.status(200).json({accessToken: accessToken})
        })
    }
    catch(err){
        res.status(500).json(err)
    }
});

router.post("/login", async (req,res)=>{
    try{
        console.log(req.body.username)
        var user = await User.findOne({username:req.body.username})
        // return res.status(200).json(user)
        //!user && res.status(400).json("Wrong Credentials!!!"))
        if (!user){
            return res.status(400).json("Wrong Credentials !!!")
        }
        const validate = await bcrypt.compare(req.body.password,user.password)
        // !validate && res.status(400).json("Wrong Credentials!!!")
        if (!validate){
            return res.status(400).json("Wrong Credentials!!!")
        }
        // const {password, ...others} = user._doc;
        // res.status(200).json(others);
        // // return
        const userm=user
        user={name: user.username,_id:user._id}
        const accessToken = generateAuthenticationToken(user)
        const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET)
        refreshTokens.push(refreshToken)
        const data = {accessToken: accessToken,refreshToken: refreshToken,_id:userm._id,username:userm.username,profilePic:userm.profilePic,email: userm.email}
        return res.status(200).json(data)
    } catch(err){
        console.log(err)
        res.status(500).json(err);
    }
});

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.sendStatus(401)
  
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      console.log(err)
      if (err) return res.sendStatus(403)
      req.user = user.userm
      next()
    })
  }

  router.get('/mypost', authenticateToken, async (req, res) => {
    let posts = await Post.find();
    console.log(posts)

    res.status(200).json(posts);
    // res.json(posts.filter(post => post.username === req.user.name))
  })
function generateAuthenticationToken(user){
    return jwt.sign(user,process.env.ACCESS_TOKEN_SECRET,{expiresIn: "30m"})
}

//Admin Register

router.post("/Adminregister",async (req,res)=>{
    try{
        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(req.body.password, salt);
        const newAdmin = new Admin({
            username: req.body.username,
            email: req.body.email,
            password: hashedPass
        })

        const admin = await newAdmin.save();
        res.status(200).json(admin);
    } catch(err){
        res.status(500).json(err);
    }
});

//Admin Login




router.post("/Adminlogin", async (req,res)=>{


    try{
        var user = await Admin.findOne({username:req.body.username})
        if (!user){
            return res.status(400).json("Wrong Credentials !!!")
        }
        const validate = await bcrypt.compare(req.body.password,user.password)
        if (!validate){
            return res.status(400).json("Wrong Credentials!!!")
        }
        const userm=user
        user={name: user.username,_id:user._id}
        const accessToken = generateAuthenticationToken(user)
        const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET)
        refreshTokens.push(refreshToken)
        const data = {accessToken: accessToken,refreshToken: refreshToken,_id:userm._id,username:userm.username,profilePic:userm.profilePic,email: userm.email}
        return res.status(200).json(data)
    } catch(err){
        console.log(err)
        res.status(500).json(err);
    }

});

// module.exports = {router,authenticateToken}

module.exports = router