const express=require("express")
const connectDB=require("./db")
const UserRoutes=require("./routes/UserRoutes")
const EventRegister=require("./routes/EventRegister")
const cerficate=require("./routes/certificate")
const cer=require("./modles/certificate")
const socketio = require("socket.io");
const pay=require("./routes/payment")
const Teams=require("./modles/event")
const app=express()
const server=require("http").createServer(app)
const io=socketio(server,{cors:{origin:"*"}})
const cors=require("cors")
const Event = require("./modles/event")
// const limiter = rateLimit({
//     windowMs: 60 * 1000, 
//     max: 10, 
//     standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
//     legacyHeaders: false, // Disable the `X-RateLimit-*` headers
//     message: {
//         status: 429,
//         error: "Too many requests, please try again after a minute.",
//     },
// });
// 

// app.use(limiter);
app.use(cors())
app.use(express.json())
app.use("/user",UserRoutes)
app.use("/event",EventRegister)
app.use("/cerficate",cerficate)
app.use("/pay",pay)

app.get("/",(req,res)=>{
    res.send("hi i am server for coding blocks kare")
})


io.on("connection",(socket)=>{
    socket.on("join",(name)=>{
        console.log(name)
        socket.join(name)
    })
    socket.on("admin",async(team)=>{
        console.log(team)
        const {name}=team
        socket.join(name)
        const Team=await Event.findOne({teamName:name})
        const {lead,members}=team
        Team.lead=lead
        Team.members=members
        io.to(name).emit("team",Team)
        await Team.save();
    })

    socket.on("leaderboard",async(team)=>{
        const {teamName}=team
        console.log(team)
        const Team=await Event.findOne({teamName:teamName})
        Team.HuntScore +=team.HuntScore
        await Team.save()
        console.log(Team)
        const teams=await Event.find();
        io.emit("leaderboard",teams.sort((a,b)=>{return b.HuntScore-a.HuntScore}));
    })
})

server.listen(3000,async ()=>{
    await connectDB()
    console.log(`http://localhost:3000`)
})
