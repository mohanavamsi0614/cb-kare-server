const express=require("express")
const router=express.Router();
const Razorpay =require("razorpay")
const Event=require("../modles/event");
const sendData = require("../sheet");
const cors = require("cors")
const nodemailer=require("nodemailer")
router.use(cors())
var instance = new Razorpay({
    key_id: 'rzp_test_EzUsahd1tsDo2l',
    key_secret: 'pe9tcaS6mMkWQPrEDUK9lF0L',
  });

  router.use(express.json())

const transporter=nodemailer.createTransport({
    service:"outlook",
    auth:{
        user:"mohanavamsi16@outlook.com",
        pass:"fmyeynjakqxqxtsm"
    }
})
router.post('/createOrder', async (req, res) => {
    const options = {
        amount: 100, 
        currency: 'INR'
    };
    try {
        const order = await instance.orders.create(options);
        res.json(order);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.post("/verify", async (req, res) => {
    const { payment_id, fullName, email, registerNumber, year, phone, department } = req.body;
    const event = "Build-a-Bot 24hrs Hackathon";
    try {
        const data = await instance.payments.fetch(payment_id);
        if (data.status === "captured") {
            await Event.create({ payment_id, fullName, email, registerNumber, phone, department, event });
            sendData(req.body);
            await transporter.sendMail({
                from: "mohanavamsi16@outlook.com",
                to: email,
                subject: "Registration Confirmation",
                text: "Thank you for registering for Build-a-Bot 24hrs Hackathon",
            });
            return res.json({ message: "done" });
        }
        return res.status(400).json({ message: "Payment not captured" });
    } catch (error) {
        console.error("Error during verification:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});


module.exports=router