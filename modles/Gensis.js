const  mongoose = require('mongoose');
const eventSchema = new mongoose.Schema({
    teamName: String,
    lead: Object,
    members: Array,
    upiId:String,
    transactionId:String,
    imgUrl: String,
    verified: { type: Boolean, default: false },
    ProblemStatement: String,
    Domain: String,
    HuntScore: { type: Number, default: 0 },
    pass: String,
    FirstReview: Object,
    SecondReview: Object,
    ThirdReview: Object,
    FirstReviewScore: { type: Number, default: 0 },
    SecoudReviewScore: { type: Number, default: 0 },
    FinalScore: Number,
    Sector: String,
    teampic: String,
    paymenttype: String,
});

const Genisis = mongoose.model('Genisis', eventSchema);
module.exports = Genisis;
