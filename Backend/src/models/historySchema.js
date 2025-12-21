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
      required: true, // If a story fails to create, this will fail. Consider required: false if you want to log failed attempts.
      index: true,
    },
    action: {
      type: String,
      // MUST include "visibility_change" to match your controller
      enum: ["create", "regenerate", "delete", "share", "visibility_change"], 
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