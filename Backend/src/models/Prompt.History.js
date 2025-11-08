import mongoose from 'mongoose';

const promptHistorySchema = new mongoose.Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  templateName: {
    type: String,
  },
  resolvedPrompt: {
    type: String,
  },
  variables: {
    type: Schema.Types.Mixed,
  },
  resultText: {
    type: String,
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: null,
  },
},{timestamps:true});

export default mongoose.model('PromptHistory', promptHistorySchema);
