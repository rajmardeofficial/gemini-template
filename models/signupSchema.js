const mongoose = require('mongoose');

const signupSchema = new mongoose.Schema({
    gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
    dateOfBirth: { type: Date, required: true },
    location: { type: String, required: true },
    pincode: { type: String, required: true },
    marriedStatus: { type: String, enum: ['Married', 'Single', 'Divorced', 'Widowed'], required: true },
    primarySkill: { type: String, required: true },
    specialization: { type: String },
    languages: { type: String, required: true },
    experienceYears: { type: Number, required: true },
    dailyHours: { type: Number, required: true },
    source: { type: String, required: true },
    workingOnOtherPlatforms: { type: Boolean, required: true },
    photo: { type: Buffer } // Store image data as a Buffer
});

const User = mongoose.model('User', signupSchema);

module.exports = User;
