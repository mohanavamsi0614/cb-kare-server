const express=require("express")
const router=express.Router()
const Event=require("../modles/event")
const nodemailer=require("nodemailer")
const dot=require("dotenv").config()
const cors = require("cors")
const { route } = require("./UserRoutes")
router.use(cors())
router.use(express.json())

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL,
    pass: process.env.PASS,
  },
});

const sendEmail = async (to, subject, html) => {
  try {
    await transporter.sendMail({
      from: process.env.MAIL,
      to,
      subject,
      html,
    });
  } catch (err) {
    console.error("Error sending email:", err);
    throw new Error("Email delivery failed");
  }
};

router.post("/team/:password",async(req,res)=>{
  const {password}=req.params
  const team=await Event.findOne({password:password})
  if(team){
    return res.json(team);
  }
  res.status(404).json("not found")
  
})

router.post("/register", async (req, res) => {
  try {
    const { lead, members, upi, txn, url, teamName } = req.body;
    const count=(await Event.find({})).length
    console.log(count)
    if (count<70){
    if (!lead || !lead.email || !teamName) {
      return res.status(400).json({ error: "Missing required fields." });
    }
    const event = await Event.create(req.body);

    const emailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; color: #333;">
        <div style="background: #E16254; color: #ECE8E7; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
          <h2 style="margin: 0; font-size: 24px;">Team Verification Under Pending</h2>
        </div>
        <div style="padding: 20px; background: #ffffff; border: 1px solid #ddd;">
          <p style="font-size: 16px; line-height: 1.5; margin-bottom: 20px;">Hello <strong style="color: #E16254;">${lead.name}</strong>,</p>
          <p style="font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
            Thank you for registering your team, <strong>${teamName}</strong>. Your submission is currently under verification. We’ll notify you as soon as the verification process is complete.
          </p>
          <p style="font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
            If you have any questions, feel free to <a href="mailto:${process.env.MAIL}" style="color: #E16254; text-decoration: none;">contact us</a>.
          </p>
          <p style="font-size: 16px; line-height: 1.5;">Best regards,</p>
          <p style="font-size: 16px; line-height: 1.5; font-weight: bold;">Coding Blocks Kare 🤍</p>
        </div>
        <div style="background: #919294; color: #ECE8E7; text-align: center; padding: 10px; font-size: 14px; border-radius: 0 0 8px 8px;">
          <p style="margin: 0;">&copy; 2024 Team. All rights reserved.</p>
        </div>
      </div>
    `;

    sendEmail(lead.email, `Your team ${teamName} is under verification`, emailContent);
    res.status(201).json({ message: "Team registered and email sent successfully", event });
  }
  else{
    res.status(401).json({message:"Restration team got filled!"})
  }
  } catch (err) {
    console.error("Error in /register:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/team/:id",async(req,res)=>{
  try {
    const { id } = req.params;
    const {email}=req.body
    console.log(email)
    const team = await Event.findByIdAndDelete(id);
    console.log(team)
    const emailContent = `
   <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; color: #333; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); border-radius: 8px; overflow: hidden;">
  <div style="background:#e16254;color:#ece8e7;padding:20px;text-align:center;display:flex;justify-content: space-between;align-items: center;">
      <h2 style="margin: 0; font-size: 20px; font-weight: bold;">Team Refund Successfull</h2>
  </div>
  <div style="padding: 20px; background: #ffffff; border: 1px solid #ddd; line-height: 1.6;">
    <p style="font-size: 16px; margin: 0 0 15px;">Hello <strong style="color: #E16254;">${team.lead.name}</strong>,</p>
    <p style="font-size: 16px; margin: 0 0 15px;">
       Your team, <strong>${team.teamName}</strong>, has been successfully withdrawed.
    </p>
    <p style="margin-top: 20px; font-size: 16px;">Best regards,</p>
    <p style="font-size: 16px; font-weight: bold; margin: 0;">Coding Blocks Kare 🤍</p>
  </div>
  <div style="background: #919294; color: #ECE8E7; text-align: center; padding: 10px; font-size: 14px;">
    <p style="margin: 0;">&copy; 2024 Team. All rights reserved.</p>
  </div>
</div>
    `;
    sendEmail(team.lead.email,"Refund Succesfull",emailContent)
     res.status(200).json({ message: "Team refunded successfully" });
  } catch (err) {
    console.error("Error in /team/:id:", err);
    res.status(500).json({ error: "Internal server error" });
  }
})

router.get("/team/:id", async (req, res) => {
    console.log("local")
    const { id } = req.params;
    const {score}=req.body;
    const team = await Event.findById(id);
    // let allm=team.members.map((i)=>{return i.regNumber+"@klu.ac.in"})
    // allm.push(team.lead.email)
    // if (!team) {
    //   return res.status(404).json({ error: "Team not found." });
    // }

    // if (!team.lead || !team.lead.email) {
    //   return res.status(400).json({ error: "Lead email is missing." });
    // }

    team.Score = score;
    await team.save();

//     const emailContent = `
//    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; color: #333; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); border-radius: 8px; overflow: hidden;">
//   <div style="background:#e16254;color:#ece8e7;padding:20px;text-align:center;display:flex;justify-content: space-between;align-items: center;">
//     <div>
//       <img src="https://res.cloudinary.com/dus9hgplo/image/upload/v1734961735/KARE_latest_ifnype.png" alt="Left Logo" style="width: 80px; border-radius:40px; height: auto;">
//     </div>
//     <div >
//       <h2 style="margin: 0; font-size: 20px; font-weight: bold;">Team Verified Successfully</h2>
//     </div>
//     <div >
//       <img src="https://res.cloudinary.com/dus9hgplo/image/upload/v1733147716/praplrjfqt3wgta1xvk1.png" alt="Right Logo" style="width: 80px; height: auto;">
//     </div>
//   </div>
//   <div style="padding: 20px; background: #ffffff; border: 1px solid #ddd; line-height: 1.6;">
//     <p style="font-size: 16px; margin: 0 0 15px;">Hello <strong style="color: #E16254;">${team.lead.name}</strong>,</p>
//     <p style="font-size: 16px; margin: 0 0 15px;">
//       Congratulations! Your team, <strong>${team.teamName}</strong>, has been successfully verified.
//     </p>
//     <p style="font-size: 16px; margin: 0 0 20px;">
//       You can now proceed with the next steps by joining the WhatsApp group.
//     </p>
//     <a href="https://chat.whatsapp.com/CBl5Jt2EorYBIrAphJFToX" style="text-decoration: none;">
//       <button style="width: 100%; cursor: pointer; max-width: 300px; height: 40px; border: none; background: green; color: #ECE8E7; border-radius: 10px; font-size: 16px; font-weight: bold; transition: background 0.3s ease;">
//         Join WhatsApp Group
//       </button>
//     </a>
//     <p style="margin-top: 20px; font-size: 16px;">Best regards,</p>
//     <p style="font-size: 16px; font-weight: bold; margin: 0;">Coding Blocks Kare 🤍</p>
//   </div>
//   <div style="background: #919294; color: #ECE8E7; text-align: center; padding: 10px; font-size: 14px;">
//     <p style="margin: 0;">&copy; 2024 Team. All rights reserved.</p>
//   </div>
// </div>
//     `;

//     await team.save()
//     await sendEmail(allm, `Your Team ${team.teamName} is Verified`, emailContent);
//     res.status(200).json({ message: "Team verified successfully" });
//   } catch (err) {
//     console.error("Error in /team/:id:", err);
//     res.status(500).json({ error: "Internal server error" });
//   }
res.json("done")
});

router.get("/students", async (req, res) => {
  try {
    const teams = await Event.find();
    res.status(200).json(teams);
  } catch (err) {
    console.error("Error in /students:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});
router.post("/team/score/:id", async (req, res) => {
  console.log("local")
  const { id } = req.params;
  console.log(req.body)
  const {team}=req.body;
  console.log(team)
  let Team = await Event.findByIdAndUpdate(id,team);
res.json("done")
});
router.post("/pro/:id",async (req,res)=>{
  const { id } = req.params;
  const {projectId}=req.body;
  const team = await Event.findById(id);
  team.ProblemID = projectId;
  await team.save();
  res.json("done")
})


module.exports = router;