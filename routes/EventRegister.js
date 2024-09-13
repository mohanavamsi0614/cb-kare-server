const express=require("express")
const router=express.Router()
const Event=require("../modles/event")
const nodemailer=require("nodemailer")
const bodyParser = require("body-parser")
const cors = require("cors")
router.use(cors())
router.use(express.json())
// const transporter=nodemailer.createTransport({
//     service:"gmail",
//     auth:{
//         user:"",
//         pass:""
//     }
// })

router.post("/register",async(req,res)=>{
    const {fullName,email,registerNclumber,phone,department,event}=req.body
    // console.log(req.body)
    const eventcheck=await Event.findOne({email,event})
    console.log(eventcheck)
    if (eventcheck && eventcheck.event==event){
        return res.status(400).json({message:"event already registered"})
    }
    const eventRegister=await Event.create(req.body)
    res.status(201).json({message:"event registered successfully",status:201})
})
router.get("/events",async(req,res)=>{
    const event=await Event.find()
    res.status(200).json({event})
})
module.exports=router   