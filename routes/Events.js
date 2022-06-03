const router = require("express").Router();
const User = require("../models/User");
const Event = require("../models/Event");

// ADD Event

router.post("/",async (req, res)=>{
    const newEvent = new Event(req.body);
    try{
        const savedEvent = await newEvent.save();
        res.status(200).json(savedEvent);
    }catch(err){
        res.status(500).json(err);
    }
    
});

//UPDATE Event

router.put("/:id",async (req,res)=>{
    try{
        const event = await Event.findById(req.params.id);
        if(event.username === req.body.username){
            try {
                const updateEvent = await Event.findByIdAndUpdate(req.params.id,{
                    $set:req.body,
                },{new: true});
                res.status(200).json(updateEvent);
            } catch (err) {
                res.status(500).json(err);
            }
        }else{
            res.status(401).json("You can update only your Event")
        }

    }catch(err){
        res.status(500).json(err);
    }
});
router.put("/sp/:id",async (req,res)=>{
    try{
        const event = await Event.findById(req.params.id);
        if(true){
            try {
                const updateEvent = await Event.findByIdAndUpdate(req.params.id,{
                    $set:req.body,
                },{new: true});
                res.status(200).json(updateEvent);
            } catch (err) {
                res.status(500).json(err);
            }
        }else{
            res.status(401).json("You can update only your Event")
        }

    }catch(err){
        res.status(500).json(err);
    }
});


//DELETE Event

router.delete("/:id",async (req,res)=>{
    try{
        const event = await Event.findById(req.params.id);
        if(event.username === req.body.username){
            try {
                await event.delete()
                res.status(200).json("Event has been deleted...");
            } catch (err) {
                res.status(500).json(err);
            }
        }else{
            res.status(401).json("You can delete only your Event!")
        }

    }catch(err){
        res.status(500).json(err);
    }
});

router.delete("/sp/:id",async (req,res)=>{
    try{
        const event = await Event.findById(req.params.id);
        if(true){
            try {
                await event.delete()
                res.status(200).json("Event has been deleted...");
            } catch (err) {
                res.status(500).json(err);
            }
        }else{
            res.status(401).json("You can delete only your Event!")
        }

    }catch(err){
        res.status(500).json(err);
    }
});


//GET Event

router.get("/:id", async (req,res)=>{
    try{
        const event = await Event.findById(req.params.id);
        res.status(200).json(event);
    }catch(err){
        res.status(500).json(err);
    }
});


//GET ALL Events

router.get("/", async (req,res)=>{
    const username = req.query.user;
    const catName = req.query.cat;
    const date = req.query.date;
    try{
        let events;
        if(username){
            events = await Event.find({username});
        }
        else if(catName){
            events = await Event.find({categories:{
                $in:[catName]
            }});
        }
        else if(date){
            events = await Event.find({date});
        }
        else{
            events = await Event.find();
        }
        res.status(200).json(events);
    }catch(err){
        res.status(500).json(err);
    }
});


module.exports = router