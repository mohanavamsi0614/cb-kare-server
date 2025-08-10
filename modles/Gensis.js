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
    password: String,
    FirstReview: Object,
    SecondReview: Object,
    ThirdReview: Object,
    FirstReviewScore: { type: Number, default: 0 },
    SecondReviewScore: { type: Number, default: 0 },
    FinalScore: Number,
    Sector: String,
    theme: String,
    paymenttype: String,
});

const Genisis = mongoose.model('Genisis', eventSchema);
module.exports = Genisis;
