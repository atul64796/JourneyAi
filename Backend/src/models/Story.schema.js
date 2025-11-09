import mongoose from 'mongoose';

const storySchema = new mongoose.Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    title: {
      type: String,
    },
    destination: {
      type: String,
    },
    inputs: {
      days: {
        type: Number,
        default: 1,
      },
      activities: [String],
      tone: { type: String, default: 'adventurous' },
      heroName: { type: String, default: 'Alex' },
      villain: {type: String, default: 'Debjit'},
    },
    prompt: {
      type: String,
    },
    resultText: {
      type: String,
    },
    parsedOutput: {
      type: Schema.Types.Mixed,
    },
    public: {
      type: Boolean,
      default: false,
    },
    likes: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Story', storySchema);
