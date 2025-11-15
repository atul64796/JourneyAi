import mongoose from "mongoose";

const storySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

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

    language: {
      type: String,
      enum: ["english", "hindi", "bengali"],
      default: "english",
    },

    templateStyle: {
      type: String,
      enum: ["cinematic", "funny", "emotional", "thriller"],
      default: "cinematic",
    },

    storyText: {
      type: String,
      required: true,
    },

    imageUrl: {
      type: String,
      default: "",
    },

    imagePrompt: {
      type: String,
      default: "",
    },

    audioUrl: {
      type: String,
      default: "",
    },

    regenerateCount: {
      type: Number,
      default: 0,
    },

    // For shareable links
    isPublic: {
      type: Boolean,
      default: false,
    },

    shareId: {
      type: String,
      unique: true,
      sparse: true,
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Story", storySchema);
