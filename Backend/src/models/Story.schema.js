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
      trim: true,
    },

    mood: {
      type: String,
      required: true,
      trim: true,
    },

    language: {
      type: String,
      enum: ["english", "hindi", "bengali"],
      default: "english",
      lowercase: true, // 🔥 auto-fix input
      trim: true,
    },

    templateStyle: {
      type: String,
      enum: ["cinematic", "funny", "emotional", "thriller"],
      default: "cinematic",
      lowercase: true, // 🔥 auto-fix input
      trim: true,
    },

    storyText: {
      type: String,
      required: true,
      trim: true,
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
      min: 0,
      max: 5,
    },

    isPublic: {
      type: Boolean,
      default: false,
    },

    shareId: {
      type: String,
      unique: true,
      sparse: true,
    },
  },
  { timestamps: true }
);

const Story = mongoose.model("Story", storySchema);
export default Story;
