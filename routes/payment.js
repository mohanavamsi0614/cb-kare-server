const express=require("express")
const router=express.Router();
const Razorpay =require("razorpay")
const Event=require("../modles/event");
const sendData = require("../sheet");

var instance = new Razorpay({
    key_id: 'rzp_test_EzUsahd1tsDo2l',
    key_secret: 'pe9tcaS6mMkWQPrEDUK9lF0L',
  });

  
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

router.post("/verify",async (req,res)=>{
    const {payment_id,fullName,email,registerNumber,year,phone,department}=req.body
    const event="Build-a-Bot 24hrs Hackathon"
     instance.payments.fetch(payment_id).then(async (data)=>{
        if(data.status=="captured"){
            await Event.create({payment_id,fullName,email,registerNumber,phone,department,event})
            sendData(req.body)
            return res.json({message:"done"})
        }
        console.log(res)
    })

})

module.exports=router