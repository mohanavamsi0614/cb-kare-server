const express = require("express");
const { google } = require("googleapis");
const router = express.Router();
const Razorpay = require("razorpay");
const Event = require("../models/event");
const cors = require("cors");
const nodemailer = require("nodemailer");
const sendData = require("../sheet");

router.use(cors());
router.use(express.json());

var instance = new Razorpay({
  key_id: 'rzp_test_EzUsahd1tsDo2l',
  key_secret: 'pe9tcaS6mMkWQPrEDUK9lF0L',
});

const transporter = nodemailer.createTransport({
  service: "outlook",
  auth: {
    user: "mohanavamsi16@outlook.com",
    pass: "fmyeynjakqxqxtsm",
  },
});

router.post("/createOrder", async (req, res) => {
  const options = {
    amount: 100,
    currency: "INR",
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
      await sendData(req.body); // <-- Make sure you're passing req.body
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

async function sendData(reqBody) {
  const { payment_id, fullName, email, year, registerNumber, phone, department } = reqBody;

  const keys = require('./mail-integration-432404-245293fe40fe.json');

  const client = new google.auth.JWT(
    keys.client_email,
    null,
    keys.private_key,
    ['https://www.googleapis.com/auth/spreadsheets']
  );

  try {
    await client.authorize();
    const sheets = google.sheets({ version: 'v4', auth: client });

    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: '1rFVctggVV83YQnWMj-QHCj4c1dXibXTV5LCZFghhAUw',
      range: 'Sheet1!A:F', 
      valueInputOption: 'RAW',
      resource: {
        values: [[fullName, email, registerNumber, year, department, phone]],
      },
    });

    console.log(response);
    return 'Data successfully added to the sheet!';
  } catch (error) {
    console.error('Error adding data to sheet:', error.response ? error.response.data : error);
    return 'Error adding data'; 
  }
}

module.exports = router;
