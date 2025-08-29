const express=require("express")
const router=express.Router()
const Innov=require("../modles/innov")
const Genisis=require("../modles/Gensis")
const nodemailer=require("nodemailer")
const dot=require("dotenv").config()
const cors = require("cors")
const Problem = require("../modles/Problem"); 
router.use(express.json())
router.use(cors({origin:"*"}))
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL,
    pass: process.env.PASS,
  },
});
const paymentVerificationTemplate = (studentName) => `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; color: #333;">
  <div style="background: #E16254; color: #ECE8E7; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
    <h2 style="margin: 0; font-size: 24px;">Team Verification in Progress</h2>
  </div>
  <div style="padding: 20px; background: #ffffff; border: 1px solid #ddd;">
    <p style="font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
      Hello <strong style="color: #E16254;">${studentName}</strong>,
    </p>
    <p style="font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
      Thank you for registering for the <strong style="color: #E16254;">Genesis Hackathon</strong>!  
      Your team details are currently under verification. No worries — we’ll send you a confirmation email as soon as the verification is complete.
    </p>
    <p style="font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
      If you have any questions, feel free to <a href="mailto:${process.env.MAIL}" style="color: #E16254; text-decoration: none;">contact us</a>.
    </p>
    <p style="font-size: 16px; line-height: 1.5;">Best regards,</p>
    <p style="font-size: 16px; line-height: 1.5; font-weight: bold;">Coding Blocks Kare 🤍</p>
  </div>

  <div style="background: #919294; color: #ECE8E7; text-align: center; padding: 10px; font-size: 14px; border-radius: 0 0 8px 8px;">
    <p style="margin: 0;">&copy; 2025 Team. All rights reserved.</p>
  </div>
</div>
`;
const registrationSuccessfulTemplate = (studentName) => `
  
   <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; color: #333; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); border-radius: 8px; overflow: hidden;">
  <div style="background:#e16254;color:#ece8e7;padding:20px;text-align:center;display:flex;justify-content: space-between;align-items: center;">
    <div>
      <img src="https://res.cloudinary.com/dus9hgplo/image/upload/v1734961735/KARE_latest_ifnype.png" alt="Left Logo" style="width: 80px; border-radius:40px; height: auto;">
    </div>
    <div >
      <h2 style="margin: 0; font-size: 20px; font-weight: bold;">Payment Verified Successfully</h2>
    </div>
    <div >
      <img src="https://res.cloudinary.com/dus9hgplo/image/upload/v1733147716/praplrjfqt3wgta1xvk1.png" alt="Right Logo" style="width: 80px; height: auto;">
    </div>
  </div>
  <div style="padding: 20px; background: #ffffff; border: 1px solid #ddd; line-height: 1.6;">
    <p style="font-size: 16px; margin: 0 0 15px;">Hello <strong style="color: #E16254;">${studentName}</strong>,</p>
    <p style="font-size: 16px; margin: 0 0 15px;">
      Congratulations! The Registration for, <strong>You</strong>, has been successfully verified.
    </p>
    <p style="font-size: 16px; margin: 0 0 20px;">
      You can now proceed with the next steps by joining the WhatsApp group.
    </p>
    <a href="https://chat.whatsapp.com/C3RvIoTKIJR39tlSRnfRtg" style="text-decoration: none;">
      <button style="width: 100%; cursor: pointer; max-width: 300px; height: 40px; border: none; background: green; color: #ECE8E7; border-radius: 10px; font-size: 16px; font-weight: bold; transition: background 0.3s ease;">
        Join WhatsApp Group
      </button>
    </a>
    <p style="margin-top: 20px; font-size: 16px;">Best regards,</p>
    <p style="font-size: 16px; font-weight: bold; margin: 0;">Coding Blocks Kare 🤍</p>
  </div>
  <div style="background: #919294; color: #ECE8E7; text-align: center; padding: 10px; font-size: 14px;">
    <p style="margin: 0;">&copy; 2025 Team. All rights reserved.</p>
  </div>
</div>
`;

const sendEmail = async (to, subject, html) => {
  try {
    await transporter.sendMail({
      from: process.env.MAIL,
      to,
      subject,
      html,
    });
    console.log(`Email sent to ${to}`);
  } catch (err) {
    console.error("Error sending email:", err);
    throw new Error("Email delivery failed");
  }
};


router.post("/gen/team/:password",async(req,res)=>{
  try{
  const {password}=req.params
  const team=await Genisis.findOne({password:password})
  if(team){
    return res.json(team);
  }
  res.status(404).json("not found")
}
catch{
  res.status(420).json("Don't act smart")
}
  
})

router.post("/gen/register",async(req,res)=>{
  const { body } = req;
  console.log(body)
  try {
    const count = (await Genisis.find({})).length;
    console.log(count);
    if (count < 99) {
      const team = await Genisis.create(body);
      const emailContent = paymentVerificationTemplate(team.lead.name);
      sendEmail(team.lead.email, "Your Payment under Verification", emailContent);
      res.json("done");
    } else {
      res.status(401).json("all done");
    }
  } catch (err) {
    console.error("Error in /gen/register:", err);
    res.status(500).json({ error: "Internal server error" });
  }
})


router.delete("/team/:id",async(req,res)=>{
  try {
    const { id } = req.params;
    const {email}=req.body
    console.log(email)
    const team = await Innov.findByIdAndDelete(id);
    console.log(team)
    const emailContent = `
   <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; color: #333; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); border-radius: 8px; overflow: hidden;">
  <div style="background:#e16254;color:#ece8e7;padding:20px;text-align:center;display:flex;justify-content: space-between;align-items: center;">
      <h2 style="margin: 0; font-size: 20px; font-weight: bold;">Team Refund Successfull</h2>
  </div>
  <div style="padding: 20px; background: #ffffff; border: 1px solid #ddd; line-height: 1.6;">
    <p style="font-size: 16px; margin: 0 0 15px;">Hello <strong style="color: #E16254;">${team.name}</strong>,</p>
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
    sendEmail(team.email,"Refund Succesfull",emailContent)
     res.status(200).json({ message: "Team refunded successfully" });
  } catch (err) {
    console.error("Error in /team/:id:", err);
    res.status(500).json({ error: "Internal server error" });
  }
})

router.get("/team/:id", async (req, res) => {
    console.log("local")
    const { id } = req.params;
    console.log(id)
    const team = await Genisis.findById(id);
    console.log(team)
    let allm=team.members.map((i)=>{return i.email})
    allm.push(team.lead.email)
    if (!team) {
      return res.status(404).json({ error: "Team not found." });
    }

    if (!team || !team.lead.email) {
      return res.status(400).json({ error: "Lead email is missing." });
    }

    team.verified = true;
    await team.save();

    const emailContent = `
   <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; color: #333; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); border-radius: 8px; overflow: hidden;">
  <div style="background:#e16254;color:#ece8e7;padding:20px;text-align:center;display:flex;justify-content: space-between;align-items: center;">
    <div>
      <img src="https://res.cloudinary.com/dus9hgplo/image/upload/v1734961735/KARE_latest_ifnype.png" alt="Left Logo" style="width: 80px; border-radius:40px; height: auto;">
    </div>
    <div >
      <h2 style="margin: 0; font-size: 20px; font-weight: bold;">Team Verified Successfully</h2>
    </div>
    <div >
      <img src="https://res.cloudinary.com/dus9hgplo/image/upload/v1733147716/praplrjfqt3wgta1xvk1.png" alt="Right Logo" style="width: 80px; height: auto;">
    </div>
  </div>
  <div style="padding: 20px; background: #ffffff; border: 1px solid #ddd; line-height: 1.6;">
    <p style="font-size: 16px; margin: 0 0 15px;">Hello ,</p>
    <p style="font-size: 16px; margin: 0 0 15px;">
      Congratulations! Your team, <strong>${team.teamName}</strong>, has been successfully verified.
    </p>
    <p style="font-size: 16px; margin: 0 0 20px;">
      You can now proceed with the next steps by joining the WhatsApp group.
    </p>
    <a href="https://chat.whatsapp.com/DtF9nmW3N2b4bgKpfBFGpB?mode=ac_t" style="text-decoration: none;">
      <button style="width: 100%; cursor: pointer; max-width: 300px; height: 40px; border: none; background: green; color: #ECE8E7; border-radius: 10px; font-size: 16px; font-weight: bold; transition: background 0.3s ease;">
        Join WhatsApp Group
      </button>
    </a>
    <p style="margin-top: 20px; font-size: 16px;">Best regards,</p>
    <p style="font-size: 16px; font-weight: bold; margin: 0;">Coding Blocks Kare 🤍</p>
  </div>
  <div style="background: #919294; color: #ECE8E7; text-align: center; padding: 10px; font-size: 14px;">
    <p style="margin: 0;">&copy; 2024 Team. All rights reserved.</p>
  </div>
</div>
    `;

    await team.save()
    await sendEmail(allm, `Your Team ${team.teamName} is Verified`, emailContent);
    res.status(200).json({ message: "Team verified successfully" });
});

router.get("/teams", async (req, res) => {
  try {
    const teams = await Genisis.find({});
    res.status(200).json(teams)
  } catch (err) {
    console.error("Error in /students:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});



router.post("/team/score/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { FirstReview, FirstScore, SecondReview, SecondScore } = req.body;

    let Team = await Genisis.findById(id);

    if (!Team) {
      return res.status(404).json({ error: "Team not found" });
    }

    if (FirstReview) {
      Team.FirstReview = FirstReview;
      Team.FirstReviewScore = FirstScore;
    }

    if (SecondReview) {
      Team.SecondReview = SecondReview;      
      Team.SecoudReviewScore = SecondScore;       
    }

    Team.FinalScore =
      (Team.FirstReviewScore || 0) + (Team.SecoudReviewScore || 0);

    await Team.save();
    return res.json({ message: "done", FinalScore: Team.FinalScore });
  } catch (e) {
    console.error("Error saving team score:", e);
    res.status(500).json({ error: "Server error, check logs" });
  }
});

router.post("/pro/:id",async (req,res)=>{
  const { id } = req.params;
  const {projectId}=req.body;
  const team = await Innov.findById(id);
  team.ProblemID = projectId;
  await team.save();
  res.json("done")
})
module.exports = router;

router.get("/problems/init", async (req, res) => {
  try {
    const problems = [
      { title: "Problem Statement 1", description: "Build an AI-powered web application that helps students and professionals save time by converting videos into concise summaries. The app should transcribe video content, generate easy-to-read notes, highlight key moments with timestamps, and adapt the summary style based on the type of video (e.g., lecture notes, meeting action items, or news briefs) and the system should also support multi-language output, allowing summaries to be translated into atleast any three languages", maxLimit: 10 },
      { title: "Problem Statement 2", description: "Create an AI-powered web application that helps users plan trips by generating personalized itineraries based on budget, destination, and duration. The system should recommend attractions, activities, and accommodations, while also offering sustainability mode with eco-friendly travel options like local homestays, public transport, and low-carbon routes. To make it more engaging, the AI should provide personalized trip companions such as a foodie guide, history expert, or adventure buddy tailored to the traveler’s interests. For global accessibility, the application should also include multi-language assistance, generating itineraries in multiple languages and offering essential travel phrases to help users communicate during their journey", maxLimit: 10 },
      { title: "Problem Statement 3", description: "Develop a generative AI model for synthesizing high-quality medical images for rare diseases, enabling robust training and benchmarking for diagnostic systems under strict privacy constraints", maxLimit: 10 },
      { title: "Problem Statement 4", description: "Build an AI system that uses generative models to simulate large-scale synthetic financial transaction datasets for advanced fraud detection and risk analysis, maintaining statistical fidelity while protecting real customer privacy", maxLimit: 10 },
      { title: "Problem Statement 5", description: "Your task is to create an AI-powered application that transforms books, articles, or study materials into engaging videos. The system should summarize long text into key points, generate a narration using natural AI voices, and automatically pair it with visuals or slides to produce an explainer-style video. To make it more advanced and futuristic, the application should offer personalized summaries, where the user can choose a reading level (for example, school student vs. researcher) and the AI adjusts the complexity of the explanation. It should also support multi-language narration, allowing a book in English to be converted into a video narrated in Tamil, Hindi, Spanish, or other languages for global accessibility. Finally, the system should provide adaptive video styles, such as explainer slides for education, cinematic visuals with background music for storytelling, or fast-paced bulletins for news content", maxLimit: 10 },
      { title: "Problem Statement 6", description: "Create a GenAI platform that automatically generates personalized, adaptive learning materials and interactive exercises from basic curriculum outlines, tailored to different learning speeds and preferences at scale", maxLimit: 10 },
      { title: "Problem Statement 7", description: "Design a generative recommendation engine that creates realistic customer personas and product suggestions, simulating entire shopping sessions for market simulation and behavioral analysis", maxLimit: 10 },
      { title: "Problem Statement 8", description: "Your task is to build an AI-powered e-commerce website using Shopify. The website should include core features like product listings, shopping cart, and secure payment integration. Additionally, integrate AI to enhance customer experience through Dynamic Pricing (adjusting prices based on demand, trends, and competition) and Voice Commerce (allowing users to search and shop using natural voice commands)", maxLimit: 10 },
      { title: "Problem Statement 9", description: "Construct a generative AI solution to design and virtually prototype innovative new mechanical components, optimizing for both functional performance and manufacturability without human CAD input", maxLimit: 10 },
      { title: "Problem Statement 10", description: "Design a GenAI model that forecasts urban air pollution levels and synthesizes actionable policy suggestions by combining environmental sensor data and predictive simulations", maxLimit: 10 },
      { title: "Problem Statement 11", description: "Develop a GenAI-powered system that generates readable, comprehensive summaries from dense legal documentation and regulatory texts, automatically highlighting risk, compliance gaps, and relevant case precedents", maxLimit: 1 },
    ];
    await Problem.deleteMany({});
    await Problem.insertMany(problems);
    res.json("Problems initialized");
  } catch (err) {
    console.error(err);
    res.status(500).json("Error initializing problems");
  }
});

// 2. Fetch all problems with availability
router.get("/problems", async (req, res) => {
  try {
    const problems = await Problem.find({});
    const formatted = problems.map(p => ({
      _id: p._id,
      title: p.title,
      description: p.description,
      available: p.assignedTeams.length < p.maxLimit,
      count: p.assignedTeams.length,
      maxLimit: p.maxLimit
    }));
    res.json(formatted);
  } catch (err) {
    console.error(err);
    res.status(500).json("Error fetching problems");
  }
});

// 3. Assign problem to a team
router.post("/problems/select/:teamId/:problemId", async (req, res) => {
  try {
    const { teamId, problemId } = req.params;
    const team = await Genisis.findById(teamId);
    const problem = await Problem.findById(problemId);

    if (!team || !problem) return res.status(404).json("Not found");

    // If team already selected a problem, return that
    if (team.ProblemStatement) {
      return res.json({ message: "Already selected", problem: team.ProblemStatement });
    }

    // Check if problem has slots left
    if (problem.assignedTeams.length >= problem.maxLimit) {
      return res.status(400).json({message:"Problem limit reached"});
    }

    // Assign problem
    problem.assignedTeams.push(team._id);
    team.ProblemStatement = problem.title;

    await problem.save();
    await team.save();

    res.json({ message: "Problem assigned", problem: team.ProblemStatement });
  } catch (err) {
    console.error(err);
    res.status(500).json("Error selecting problem");
  }
});

// 4. Get problem assigned to a team
router.get("/problems/team/:teamId", async (req, res) => {
  try {
    const { teamId } = req.params;
    const team = await Genisis.findById(teamId);
    if (!team) return res.status(404).json("Team not found");

    // Find problem details
    if (team.ProblemStatement) {
      const problem = await Problem.findOne({ title: team.ProblemStatement });
      res.json({
        problem: {
          title: team.ProblemStatement,
          description: problem?.description || "No description provided",
        },
      });
    } else {
      res.json({ problem: null });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json("Error fetching team problem");
  }
});
