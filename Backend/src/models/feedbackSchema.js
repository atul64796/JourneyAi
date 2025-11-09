// models/feedbackModel.js
const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId,
     ref: 'User' 
    },
  story: {
     type: mongoose.Schema.Types.ObjectId,
      ref: 'Story' 
    },
  rating: {
     type: Number,
      min: 1,
      max: 5,
      default: 5 
    },
  comment: { 
    type: String,
     trim: true 
    },
},{timestamps:true});

module.exports = mongoose.model('Feedback', feedbackSchema);