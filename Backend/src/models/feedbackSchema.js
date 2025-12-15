import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    storyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Story",
      required: true,
    },

    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: 5,
      required: true,
    },

    comment: {
      type: String,
      trim: true,
    },

    response: {
      type: String,
      trim: true,
    },

    sentiment: {
      type: String,
      enum: ["positive", "negative", "neutral"],
      default: "positive",
    },

    status: {
      type: String,
      enum: ["pending", "reviewed", "resolved"],
      default: "pending",
    },
  },
  { timestamps: true }
);

// prevent duplicate feedback per story per user
feedbackSchema.index({ user: 1, storyId: 1 }, { unique: true });

const Feedback = mongoose.model("Feedback", feedbackSchema);
export default Feedback;
