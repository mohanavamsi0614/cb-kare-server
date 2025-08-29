const Gen = require("./modles/Gensis.js")
const connectDB = require("./db")
const fs=require("fs")
async function doSomething() {
    try {
        await connectDB()
        let it=0
        const teams=await Gen.find({})
        for (let team of teams) {
        console.log(team.lead.email.slice(6,7))
        if(team.lead.email.slice(6,7)=="8"){
            it++
        }
        for(let mem of team.members) {
            console.log(mem.email.slice(6,7))
            if(mem.email.slice(6,7)=="8"){
                it++
            }
        }

    }
    console.log("Total teams with 80 in email:", it)
    return it
}
catch (error) {
    console.error("Error:", error)
}
}

async function sort(){
            await connectDB()
            const passwords=[]
            const teams = await Gen.find({})
            for(let team of teams){
                team.pass=team.lead.email.split("@")[0].slice(-1)+team.members.map((i)=>{return i.email.split("@")[0].slice(-1)}).join("")
                let pass=team.lead.email.split("@")[0].slice(-1)+team.members.map((i)=>{return i.email.split("@")[0].slice(-1)}).join("")
                if(passwords.includes(pass)){
                    console.log("Duplicate password found:", pass)
                }
                passwords.push(pass)
                await team.save()
            }
            fs.writeFileSync("passwords.txt", passwords.join("\n"))
            console.log("Passwords saved to passwords.txt")
}
// doSomething()

sort()