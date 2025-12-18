import mongoose from "mongoose";

const historySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    storyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Story",
      required: true,
      index: true,
    },

    action: {
      type: String,
      enum: ["create", "regenerate", "delete", "share"],
      required: true,
    },

    regenerateCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const History = mongoose.model("History", historySchema);
export default History;
