// models/historyModel.js
const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  story: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Story',
    required: true,
  },
  destination: {
    type: String,
    required: true,
  },
  duration: {
    type: String,
    required: true,
  },
  mood: {
    type: String,
    required: true,
  },
  regeneratedCount: {
    type: Number,
    default: 0,  // number of times user re-generated this story
  },
},{timestamps:true});

module.exports = mongoose.model('History', historySchema);
