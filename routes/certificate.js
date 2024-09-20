const express=require("express")
const router=express.Router()
const Certificate=require("../modles/certificate")
const cors = require("cors")
router.use(cors())
router.use(express.json())

router.post("/add",async (req,res)=>{
    await Certificate.create(req.body)
    res.send("done")
})
router.post('/verify-certificate', async (req, res) => {
    try {
        const certID = req.body.certID;

        const certificate = await Certificate.findOne({ Certificate_id: certID });

        if (!certificate) {
            return res.status(404).json({ message: 'Certificate not found!' });
        }

        res.json({
            name: certificate.Name,
            reg_no: certificate.reg_no,
            winning_date: certificate.Winning_Date,
            winning_place: certificate.Winning_place,
            img_url: certificate.Img_url,
            CertificateID:certificate.Certificate_id
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

module.exports=router;