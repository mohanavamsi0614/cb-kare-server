const mongoose=require("mongoose")
const connectDB=async()=>{
    try {
        await mongoose.connect("mongodb+srv://mohanavamsi14:vamsi@cluster.74mis.mongodb.net/?retryWrites=true&w=majority&appName=Cluster")
        console.log("connected to db")
    } catch (error) {
        console.log(error)
    }
}
module.exports=connectDB
