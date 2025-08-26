const express=require("express")
const router=express.Router()
const Genisis=require("../modles/Gensis")


router.get("/",async(req,res)=>{
    try {
        const genisis=await Genisis.find({})
        res.json(genisis)
    } catch (error) {
        res.status(500).json({message:error.message})
    }
})

router.get("/:pass",async(req,res)=>{
    try {
        const genisis=await Genisis.findOne({pass:req.params.pass})
        if(!genisis) return res.status(404).json({message:"Genisis not found"})
        res.json(genisis)
    } catch (error) {
        res.status(500).json({message:error.message})
    }
})
router.post("/pic",async(req,res)=>{
    const {img,teamname}=req.body
    try {
        const team=await Genisis.findOne({teamName:teamname})
        if(!team) return res.status(404).json({message:"Genisis not found"})
        team.teampic=img
        await team.save()
        res.status(201).json(team)
    } catch (error) {
        res.status(500).json({message:error.message})
    }
})
router.post("/attd/:id/:name",async(req,res)=>{
    try {
        const {id,name}=req.params
        const {img,type}=req.body   
        console.log(type)
        console.log("Received image:", img,id,name);
        const team=await Genisis.findById(id)
        if(!team) return res.status(404).json({message:"Genisis not found"})
            // console.log("Found team:", team);
        console.log("Checking lead:", team.lead.name);
        if(team.lead.name.trim()==name.trim()){
            team.lead[type]=img
            team.markModified('lead') 
            console.log("Updated lead image:", team.lead[type]);
            await team.save()
                   return res.status(201).json(team)

            }
        for(let member of team.members){
            console.log("Checking member:", member.name);
            if(member.name.trim()==name.trim()){
                member[type]=img
                team.markModified('members')
                console.log("Updated member image:", member[type]);
                break
            }
        }
        await team.save()
        // console.log("Updated team:", team);
        return res.status(201).json(team)
    } catch (error) {
        res.status(500).json({message:error.message})
    }
})

module.exports=router