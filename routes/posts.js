const router = require("express").Router();
const User = require("../models/User");
const Post = require("../models/Post");
const jwt = require('jsonwebtoken')
const Redis = require('redis')

// const redisClient = Redis.createClient({socket: { port: 6379, host: 'redisdb' } ,legacyMode: true});
// const redisClient = Redis.createClient({legacyMode: true});

// redisClient.connect()


// const authenticateToken = require("./auth.js")

//CREATE BLo

// router.get("/all",async (req,res)=>{
//     try{
//         redisClient.get("posts", async (error,posts) => {
//             if(error) console.log(error)
//             if(posts != null) {
//                 console.log("Cache Hit")
//                 return res.json(JSON.parse(posts))
//             }
//             else{
//                 let posts = await Post.find();
//                 redisClient.setex("posts",600,JSON.stringify(posts))
//                 console.log('Cache Miss')
//             }
//             res.status(200).json(posts);
//         })
        
//     }
//     catch(err){
//         console.log("went wrong")
//         res.status(500).json(err);
//     }
// })


function authenticateToken(req, res, next) {
    const authHeader = req.body.headers['Authorization'];
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.sendStatus(403)
  
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) return res.sendStatus(401)
      req.user = user
      next()
    })
  }
  router.get("/mypost",authenticateToken,async (req,res)=>{
      const username= req.user.name;
      console.log(username)
      let posts = await(Post.find({username}))
    res.status(200).json(posts)
})

router.post("/",async (req, res)=>{
    const newPost = new Post(req.body);
    try{
        const savedPost = await newPost.save();
        res.status(200).json(savedPost)
    }catch(err){
        res.status(500).json(err);
    }
    
});


//UPDATE POST

router.put("/:id",authenticateToken,async (req,res)=>{
    try{
        // console.log(req.body)
        const post = await Post.findById(req.params.id);
        if(post.username === req.body.username){
            try {
                const updatePost = await Post.findByIdAndUpdate(req.params.id,{
                    $set:req.body,
                },{new: true});
                res.status(200).json(updatePost);
            } catch (err) {
                res.status(500).json(err);
            }
        }else{
            res.status(401).json("You can update only your post!")
        }

    }catch(err){
        res.status(500).json(err);
    }
});

router.put("/like/:id",async (req,res)=>{
    try{
        const post = await Post.findById(req.params.id);
        try {
            const updatePost = await Post.findByIdAndUpdate(req.params.id,{
                $set:req.body,
            },{new: true});
            res.status(200).json(updatePost);
        } catch (err) {
            res.status(500).json(err);
        }

    }catch(err){
        res.status(500).json(err);
    }
});

router.put("/comment/:id",async (req,res)=>{
    try{
        const post = await Post.findById(req.params.id);
        try {
            const updatePost = await Post.findByIdAndUpdate(req.params.id,{
                $set:req.body,
            },{new: true});
            res.status(200).json(updatePost);
        } catch (err) {
            res.status(500).json(err);
        }

    }catch(err){
        res.status(500).json(err);
    }
});

router.put("/sp/:id",async (req,res)=>{
    try{
        const post = await Post.findById(req.params.id);
        if(post.username === post.username){
            try {
                const updatePost = await Post.findByIdAndUpdate(req.params.id,{
                    $set:req.body,
                },{new: true});
                res.status(200).json(updatePost);
            } catch (err) {
                res.status(500).json(err);
            }
        }else{
            res.status(401).json("You can update only your post!")
        }

    }catch(err){
        res.status(500).json(err);
    }
});


//DELETE POST

router.delete("/:id",authenticateToken,async (req,res)=>{
    try{
        const post = await Post.findById(req.params.id);
        if(post.username === req.body.username){
            try {
                await post.delete()
                res.status(200).json("Post has been deleted...");
            } catch (err) {
                res.status(500).json(err);
            }
        }else{
            res.status(401).json("You can delete only your post!")
        }

    }catch(err){
        res.status(500).json(err);
    }
});


router.delete("/sp/:id",async (req,res)=>{
    try{
        const post = await Post.findById(req.params.id);
        if(post.username === post.username){
            try {
                await post.delete()
                res.status(200).json("Post has been deleted...");
            } catch (err) {
                res.status(500).json(err);
            }
        }else{
            res.status(401).json("You can delete only your post!")
        }

    }catch(err){
        res.status(500).json(err);
    }
});


//GET POST

router.get("/:id", async (req,res)=>{
    try{
        const post = await Post.findById(req.params.id);
        res.status(200).json(post);
    }catch(err){
        res.status(500).json(err);
    }
});


//GET ALL POSTS

router.get("/", async (req,res)=>{
    const username = req.query.user;
    const catName = req.query.cat;
    const title = req.query.title;
    try{
        let posts;
        if(username){
            posts = await Post.find({username});
        }
        else if(catName){
            posts = await Post.find({categories:{
                $in:[catName]
            }});
        }
        else if(title){
            posts = await Post.find({title});
        }
        else{
            posts = await Post.find();
        }
        res.status(200).json(posts);
    }catch(err){
        res.status(500).json(err);
    }
});


module.exports = router