const express=require("express")
const router=express.Router()
const Event=require("../modles/event")
const nodemailer=require("nodemailer")
const dot=require("dotenv").config()
const cors = require("cors")
router.use(cors())
router.use(express.json())

const transpoter=nodemailer.createTransport({
    auth:{
        user:process.env.MAIL,
        pass:process.env.PASS
    },
    service:"gmail"
})

router.post("/register",async (req,res)=>{
    try{
        const {lead,members,upi,txn,url,teamName}=req.body
        await Event.create(req.body)
        await transpoter.sendMail({to:lead.email,from:process.env.MAIL,html:`Your team:${teamName} under verification`})
        res.json("done");
    }
    catch(e){
        res.json(e)
    }
})

router.get("/team/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const team = await Event.findById(id);
      console.log(team.lead)
      if (!team) {
        return res.status(404).json({ error: "Team not found." });
      }
  
      if (!team.lead || !team.lead.email) {
        return res.status(400).json({ error: "Lead email is missing." });
      }
  
      team.verified = true;
  
      await transpoter.sendMail({
        to: team.lead.email,
        from: process.env.MAIL,
        subject: "Team Verified",
        text: `Your team "${team.teamName}" has been verified.`,
      });
  
      await team.save();
      res.json("done");
    } catch (e) {
      console.error("Error in /team/:id:", e);
      res.status(500).json(e);
    }
  });
  

router.get("/students",async(req,res)=>{
    try{
        const students=await Event.find();
        res.status(200).json(students);
    }
    catch(e){
        res.json(e)
    }
})
module.exports=router   