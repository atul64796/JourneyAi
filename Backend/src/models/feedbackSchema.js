const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true 
  },

  story: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Story',
    required: true 
  }, //hello

  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: 5,
    required: true
  },

  comment: { 
    type: String,
    trim: true 
  },

  response: {
    type: String,
    trim: true,
  },

  sentiment: {
    type: String,
    enum: ['positive', 'negative', 'neutral'],
    default: 'positive',
  },

  status: {
    type: String,
    enum: ['pending', 'reviewed', 'resolved'],
    default: 'pending',
  },

}, { timestamps: true });

// Prevent duplicate feedback by same user
feedbackSchema.index({ user: 1, story: 1 }, { unique: true });

module.exports = mongoose.model('Feedback', feedbackSchema);
