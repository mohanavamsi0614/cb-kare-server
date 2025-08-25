const Gen = require("./modles/Gensis.js")
const connectDB = require("./db")
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

    let teams = await (await Gen.find({})).map((i)=>i.teamName)
    teams = teams.sort((a, b) => a.localeCompare(b));

    console.log(teams)
    return teams
}
// doSomething()

sort()