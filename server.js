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
const codebreak = require("./modles/codebrack")
const Innov=require("./modles/innov")
let domains = [
    { id: "1", name: "Healthcare & Biotech",slots:25 },
    { id: "2", name: "Fintech & Blockchain",slots:25  },
    { id: "3", name: "AI & Machine Learning",slots:25  },
    { id: "4", name: "IoT & Smart Technologies",slots:25  },
    { id: "5", name: "EdTech & E-Learning",slots:25  },
    { id: "6", name: "Sustainability & CleanTech",slots:25  }
]
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
const count=0
app.use(cors({origin:"*"}))
app.use(express.json())
app.use("/user",UserRoutes)
app.use("/event",EventRegister)
app.use("/cerficate",cerficate)
app.use("/pay",pay)

app.get("/",(req,res)=>{
    res.send("hi i am server for coding blocks kare")
})

app.post('/' , (req , res)=>{
    const {name,regnumber,year,email}=req.body
})

io.on("connection",(socket)=>{
    socket.on("join",(name)=>{
        console.log(name)
        socket.join(name)
    })
    socket.on("domainSelected",async(team)=>{
        const {teamId,domain}=team
        console.log(team)
        const Team=await Innov.findById(teamId)
        console.log(domains.find((i)=>{return i.id==domain}))
        Team.Domain=domains.find((i)=>{return i.id==domain}).name
        await Team.save()
        socket.join(Team.teamname)
        socket.to(Team.teamname).emit("domainSelected","done")
        domains.forEach((i)=>{ 
            if(i.id==domain){
               i.slots=i.slots-1
            }})
        console.log(domains)
        socket.emit("domaindata",domains)
    })
    socket.on("domaindat",(res)=>{
        console.log(res)
        socket.emit("domaindata",domains)
    })
    socket.on("admin",async(team)=>{
        console.log(team)
        const {name}=team
        socket.join(name)
        const Team=await Innov.findOne({teamname:name})
        console.log(Team)
        const {lead,teamMembers}=team
        Team.lead=lead
        Team.teamMembers=teamMembers
        io.to(name).emit("team",Team)
        await Team.save();
    })

    socket.on("leaderboard",async(team)=>{
        const {teamName}=team
        console.log(team)
        const Team=await Innov.findOne({teamname:teamName})
        Team.SquidScore +=team.SquidScore
        await Team.save()
        console.log(Team)
        const teams=await Innov.find();
        io.emit("leaderboard",teams.sort((a,b)=>{return b.SquidScore-a.SquidScore}));
    })
    socket.on("reg",async()=>{
        const count=(await Innov.find({})).length
        if (count>=90){
            io.emit("check","stop")
        }
        else{
            io.emit("check","ok")
        }
    })
    socket.on("check",async()=>{
        const count=(await Innov.find({})).length
        if (count>=90){
            io.emit("see","stop")
        }
        else{
            io.emit("see","omk")
        }
    })
})

server.listen(3001,async ()=>{
    await connectDB()
    console.log(`http://localhost:3001`)
})
