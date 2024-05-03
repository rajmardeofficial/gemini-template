const mongoose = require('mongoose');

const onboardSchema = new mongoose.Schema({
    income: { type: Number, required: true },
    qualification: { type: String, required: true },
    laws: { type: String, required: true },
    instagramLink: { type: String, required: true },
    facebookLink: { type: String, required: true },
    linkedinLink: { type: String, required: true },
    link: { type: String, required: true },
    minEarning: { type: Number, required: true },
    bio: { type: String, required: true },
    refer: { type: String, required: true }
});

const Onboard = mongoose.model('Onboard', onboardSchema);

module.exports = Onboard;
