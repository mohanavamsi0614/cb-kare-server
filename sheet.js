const nodemailer=require("nodemailer")
const dot=require("dotenv").config()

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL,
    pass: process.env.PASS,
  },
})

transporter.sendMail({
    to: "mohanavamsi14@gmail.com",
    from:process.env.MAIL,
    subject:"Invitation to CB KARE Core Team Meet – Announcement of Selected Roles",
    html:`<div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; color: #333;">
  <div style="background: #E16254; color: #ECE8E7; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
    <h2 style="margin: 0; font-size: 24px;">🎉 Congratulations! You're Selected 🎉</h2>
  </div>

  <div style="padding: 20px; background: #ffffff; border: 1px solid #ddd;">
    <p style="font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
      Hello <strong style="color: #E16254;">Vamsi</strong>,
    </p>

    <p style="font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
      We are thrilled to inform you that you’ve been <strong style="color: #E16254;">selected</strong> for the <strong>Code Breaker Challenge</strong>! 🎊
    </p>

    <p style="font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
      To get you started, we’re inviting you to join a <strong>pre-event meeting</strong>, where we’ll walk you through all event details, expectations, and guidelines.
    </p>

    <p style="font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
      <strong style="color: #E16254;">Meeting Details:</strong><br>
      📅 <strong>Tomorrow</strong><br>
      🕒 <strong>4:00 PM to 5:00 PM</strong><br>
    </p>

    <p style="font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
      Please make sure to attend this session to prepare for the upcoming challenge.
    </p>

    <p style="font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
      If you have any questions, feel free to <a href="mailto:${process.env.MAIL}" style="color: #E16254; text-decoration: none;">contact us</a>.
    </p>

    <p style="font-size: 16px; line-height: 1.5;">Best regards,</p>
    <p style="font-size: 16px; line-height: 1.5; font-weight: bold;">Team Coding Blocks Kare 🤍</p>
  </div>

  <div style="background: #919294; color: #ECE8E7; text-align: center; padding: 10px; font-size: 14px; border-radius: 0 0 8px 8px;">
    <p style="margin: 0;">&copy; 2025 Team Coding Blocks Kare. All rights reserved.</p>
  </div>
</div>
`
})