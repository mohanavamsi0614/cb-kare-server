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
const Food=require("./modles/Food")
let prev=""
let domains = [
    { 
        id: "1", 
        name: "EdTech",
        slots: 10,
        description: "Innovations for enhancing learning experiences, course management, and skill development."
    },
    { 
        id: "2", 
        name: "Campus Automation",
        slots: 10,
        description: "Solutions for smart attendance, resource allocation."
    },
    { 
        id: "3", 
        name: "HealthTech",
        slots: 10,
        description: "Apps for mental health, fitness tracking, and on-campus medical assistance."
    },
    { 
        id: "4", 
        name: "HostelConnect",
        slots: 10,
        description: "Platforms for room allocation, maintenance requests, and complaint tracking."
    },
    { 
        id: "5", 
        name: "FoodieHub",
        slots: 10,
        description: "Apps for food ordering, meal pre-booking, and digital payments."
    },
    { 
        id: "6", 
        name: "GreenCampus",
        slots: 10,
        description: "Eco-friendly solutions for waste management and energy efficiency."
    },
    { 
        id: "7", 
        name: "Transport Solutions",
        slots: 10,
        description: "Smart transportation, tracking, and optimization of on-campus buses and cabs."
    },
    { 
        id: "8", 
        name: "Student Engagement",
        slots: 10,
        description: "Apps for student clubs, campus events, and extracurricular activities management."
    },
    { 
        id: "9", 
        name: "Digital Learning Platforms",
        slots: 10,
        description: "Interactive e-learning platforms, content sharing, and peer-to-peer learning."
    }
]
let domainStat=false
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

app.post("/food", async (req, res) => {
    try {
        const existingFood = await Food.findOne({teamname: req.body.teamname});
        // console.log(existingFood);
        
        if (existingFood) {
            if (req.body.food && Array.isArray(req.body.food)) {
                existingFood.food = existingFood.food.concat(req.body.food);
            }
            existingFood.price +=req.body.price
            await existingFood.save();
            res.json(existingFood);
        } else {
            const newFood = await Food.create(req.body);
            res.json(newFood);
        }
        
    } catch (error) {
        console.error("Error handling food:", error);
        res.status(500).json({ error: error.message });
    }
});

app.get("/food",async(req,res)=>{
    const foods=await Food.find({})
    res.json(foods)
})
app.post('/pic' , async(req , res)=>{
    try{
    const {id,photo}=req.body
    const Team=await Innov.findById(id)
    Team.GroupPic=photo
    await Team.save()
    res.json("done")
    }
    catch(r){
        console.log(r)
        res.send(r)
    }
})
app.post("/problemSta",async (req,res)=>{
    try{
    const {id,PS}=req.body
    const Team=await Innov.findById(id)
    Team.ProblemStatement=PS
    await Team.save()
    res.json(PS)
    }
    catch(r){
        console.log(r)
        res.send(r)
    }

})
io.on("connection",(socket)=>{

    socket.on("join",(name)=>{
        console.log(name)
        socket.join(name)
    })
    socket.on("eventupdates",(text)=>{
        prev=text
        io.emit("eventupdates",text)
    })
    socket.on("prevevent",()=>{
        io.emit("eventupdates",prev)
    })
    socket.on("domainStat",()=>{
        io.emit("domainStat",domainStat)
    })
    socket.on("domainOpen",()=>{
        domainStat=true
        io.emit("domainStat",true)
    })
    socket.on("domainSelected",async(team)=>{
        const {teamId,domain}=team
        if(domains.find((i)=>{return i.id==domain}).slots==0){
            io.emit("domaindata","fulled")
        }
        console.log(team)
        const Team=await Innov.findById(teamId)
        socket.join(Team.teamname)
        io.to(Team.teamname).emit("domainSelected",domains.find((i)=>{return i.id==domain}))
        domains.forEach((i)=>{ 
            if(i.id==domain){
               i.slots=i.slots-1
            }})
        console.log(domains)
        io.emit("domaindata",domains)
        console.log(domains.find((i)=>{return i.id==domain}))

        Team.Domain=domains.find((i)=>{return i.id==domain}).name
        await Team.save()
    })
    socket.on("domaindat",(res)=>{
        io.emit("domaindata",domains)
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
        const {teamname}=team
        const Team=await Innov.findOne({teamname:teamname})
        if(Team.SquidScore){
            Team.SquidScore +=team.SquidScore
        }
        else{
            Team.SquidScore=team.SquidScore
        }
        await Team.save()
        let teams=await Innov.find({});
        teams=teams.sort((a,b)=>{return b.SquidScore-a.SquidScore})
        console.log(teams)
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
