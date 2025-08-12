const Gen = require("./modles/Gensis.js")
const connectDB = require("./db")
async function doSomething() {
    try {
        await connectDB()
        let it=0
        const teams=await Gen.find({})
        for (let team of teams) {
        console.log(team.lead.email.slice(6,8))
        if(team.lead.email.slice(6,8)=="80"){
            it++
        }
        for(let mem of team.members) {
            console.log(mem.email.slice(6,8))
            if(mem.email.slice(6,8)=="80"){
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
doSomething()