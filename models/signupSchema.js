const mongoose = require("mongoose");

const signupSchema = new mongoose.Schema({
  gender: { type: String, required: true },
  dateOfBirth:{type:String}  ,
  location: { type: String, required: true },
  pincode: { type: String, required: true },
  marriedStatus: { type: String, required: true },
  primarySkill: { type: String, required: true },
  specialization: { type: String },
  languages: { type: String, required: true },
  experienceYears: { type: String, required: true },
  dailyHours: { type: String, required: true },
  source: { type: String, required: true },
  workingOnOtherPlatforms: { type: String,  },
 // photo: { type: Buffer },  Store image data as a Buffer
});

const Skill = mongoose.model("Skill", signupSchema);

module.exports = Skill;
