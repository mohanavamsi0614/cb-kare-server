const mongoose=require("mongoose")
const eventSchema=new mongoose.Schema({
    teamName:String,
    lead:Object,
    members:Array,
    upiId:String,
    transtationId:String,
    imgUrl:String,
    verified:{type:Boolean,default:false}
})
const Event=mongoose.model("Event",eventSchema)
module.exports=Event