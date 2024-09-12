const mongoose=require("mongoose")
const eventSchema=new mongoose.Schema({
    fullName:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    registerNumber:{type:String,required:true},
    phone:{type:String,required:true},
    department:{type:String,required:true},
    event:{type:String,required:true}
    
})
const Event=mongoose.model("Event",eventSchema)
module.exports=Event