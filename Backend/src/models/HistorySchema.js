import mongoose from "mongoose";

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

  language: {
    type: String,
    enum: ['english', 'hindi', 'bengali'],
    default: 'english',
  },

  templateStyle: {
    type: String,
    enum: ['cinematic', 'funny', 'emotional', 'thriller'],
    default: 'cinematic',
  },

  regeneratedCount: {
    type: Number,
    default: 0,
  },

  status: {
    type: String,
    enum: ['success', 'failed'],
    default: 'success',
  },

  errorMessage: {
    type: String,
    default: '',
  },

  modelUsed: {
    type: String,
    default: 'gpt-4.1',
  },

  aiProvider: {
    type: String,
    enum: ['openai', 'gemini'],
    default: 'gemini',
  },

  deviceType: {
    type: String,
    default: 'web',
  },

  timeTaken: {
    type: Number,
    default: 0, // in ms
  },

}, { timestamps: true });

module.exports = mongoose.model('History', historySchema);
