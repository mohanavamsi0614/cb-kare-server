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
    FinalScore:Number,
    Sector:String
})
const Event=mongoose.model("innov",eventSchema)
module.exports=Event;

async function data(){
    const teams= await Event.find({})
    for (let i of teams){
        if(i.SecoundReviewScore){
            console.log(i.teamname)
            i.FirstReviewScore=i.SecoundReviewScore
            i.SecoundReviewScore=0
            
        }
        await i.save()
    }
    console.log("done")

}
// data()