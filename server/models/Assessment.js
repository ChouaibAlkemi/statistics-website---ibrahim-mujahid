const mongoose = require('mongoose');

const assessmentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false, // Allow anonymous assessments if needed, or link to user
  },
  answers: {
    type: [Number], // Array of 50 numbers (0-4)
    required: true,
    validate: [arrayLimit, '{PATH} exceeds the limit of 50'],
  },
  totalScore: {
    type: Number,
    required: true,
  },
  aggressionLevel: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    required: true,
  },
}, { timestamps: true });

function arrayLimit(val) {
  return val.length === 50;
}

module.exports = mongoose.model('Assessment', assessmentSchema);
