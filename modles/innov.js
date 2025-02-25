const mongoose=require("mongoose")
const eventSchema=new mongoose.Schema({
    teamname:String,
    email:String,
name: String,
registrationNumber:String,
room:String,
type:String,
lead:Object,
GroupPic:String,
    teamMembers:Array,
    upiId:String,
    transtationId:String,
    imgUrl:String,
    verified:{type:Boolean,default:false},
    ProblemStatement:String,
    Domain:String,
    SquidScore:Number,
    password:String,
    FirstReview:Object,
    SecoundReview:Object,
    ThirdReview:Object,
    FirstReviewScore:{type:Number,default:0},
    SecoundReviewScore:{type:Number,default:0},
    ThirdReviewScore:{type:Number,default:0},
    FinalScore:Number
})
const Event=mongoose.model("innov",eventSchema)
module.exports=Event;