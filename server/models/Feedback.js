const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  anonymousName: {
    type: String,
    required: true,
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
  feedbackText: {
    type: String,
    required: true,
    maxlength: 300,
  },
  approved: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

module.exports = mongoose.model('Feedback', feedbackSchema);
