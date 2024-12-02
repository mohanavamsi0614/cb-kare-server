const express=require("express")
const connectDB=require("./db")
const UserRoutes=require("./routes/UserRoutes")
const EventRegister=require("./routes/EventRegister")
const cerficate=require("./routes/certificate")
const cer=require("./modles/certificate")
const pay=require("./routes/payment")
const app=express()
const cors=require("cors")
app.use(cors())
app.use(express.json())
app.use("/user",UserRoutes)
app.use("/event",EventRegister)
app.use("/cerficate",cerficate)
app.use("/pay",pay)
app.get("/",(req,res)=>{
    res.send("hi i am server for coding blocks kare")
})


app.listen(3000,async ()=>{
    await connectDB()
    console.log(`http://localhost:3000`)
})
