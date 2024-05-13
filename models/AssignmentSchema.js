const mongoose = require('mongoose');

const AssignMentSchema = new mongoose.Schema({
  Noofcase: { type: String, required: true },
  fulltimeJob: { type: String, required: true },
  caseStudy1: { type: String, required: true },
  caseStudy2: { type: String, required: true },
});

const AssignmentDetails = mongoose.model('AssignMent', AssignMentSchema);

module.exports = AssignmentDetails;
