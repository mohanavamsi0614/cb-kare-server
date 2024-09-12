const express=require("express")
const connectDB=require("./db")
const UserRoutes=require("./routes/UserRoutes")
const EventRegister=require("./routes/EventRegister")
const app=express()
app.use(express.json())
app.use("/user",UserRoutes)
app.use("/event",EventRegister)
app.get("/",(req,res)=>{
    res.send("hi i am server for coding blocks kare")
})

app.listen(5676,()=>{
    connectDB()
    console.log(`http://localhost:5676`)
})
