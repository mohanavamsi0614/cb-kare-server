const mongoose=require("mongoose")
const env=require("dotenv").config()
const connectDB=async()=>{
    try {
        await mongoose.connect(process.env.uri)
        console.log("connected to db")
    } catch (error) {
        console.log(error)
    }
}
module.exports=connectDB
