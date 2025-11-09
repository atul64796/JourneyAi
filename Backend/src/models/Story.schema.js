// models/storyModel.js
const mongoose = require('mongoose');

const storySchema = new mongoose.Schema({
  destination: {
    type: String,
    required: true,
    trim: true,
  },
  duration: {
    type: String,
    required: true,
  },
  mood: {
    type: String,
    required: true,
  },
  storyText: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    default: '',
  },
  audioUrl: {
    type: String,
    default: '',
  }
},{timestamps:true});

module.exports = mongoose.model('Story', storySchema);
