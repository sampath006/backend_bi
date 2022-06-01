
const router = require("express").Router();
const Admin = require("../models/Admin");
const bcrypt = require("bcrypt");
const User = require("../models/User");


router.get("/",async (req,res)=>{
   try{ 
    const admin = await Admin.find();
    console.log(admin)
    res.status(200).json(admin);
}
    catch(err){
        console.log(err)
        res.status(400).json(err);
    }
}
);
//UPDATE Admin Accout
router.put("/:id",async (req,res)=>{
    if(req.body.adminId === req.params.id){
        if(req.body.password){
            const salt = await bcrypt.genSalt(10);
            req.body.password = await bcrypt.hash(req.body.password,salt)
        }
        try{
            const updateAdmin = await  Admin.findByIdAndUpdate(req.params.id,{
                $set: req.body,
            },{new:true});
            res.status(200).json(updateAdmin);
        } catch(err){
            res.status(500).json(err);
        }
    }
    else{
        res.status(401).json("You can update only your accout!");
    }
    
});


//GET Admin Accout

router.get("/:id", async (req,res)=>{
    try{
        const admin = await Admin.findById(req.params.id,'-password');
        const {password, ...others} = admin._doc;
        res.status(200).json(admin);
    }catch(err){
        res.status(500).json(err)
    }
});


router.post("/register",async(req,res)=>{
    try{
        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(req.body.password,salt);
        const newAdmin = new Admin({
            username: req.body.username,
            email: req.body.email,
            password: hashedPass,
        })
        const user = await newAdmin.save();
        const {password,...others}=user
        console.log(user)
        res.status(200).json(others);
    }
    catch(err){
        res.status(500).json(err)
    }
});

module.exports = router