import { asyncHandler } from "../utils/AsyncHandler";
import { ApiResponse } from "../utils/ApiResponse.js";
import User from "../models/User.Schema.js";
import Story from "../models/Story.schema.js";
import Feedback from "../models/Feedback.schema.js";
import History from "../models/historySchema.js";

export const getUserDetailsForAdmin = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const user = await User.findById(userId).select("-password");
  if (!user) {
    return res
      .status(404)
      .json(new ApiResponse(404, null, "User not found"));
  }

  const [stories, feedbacks, history] = await Promise.all([
    Story.find({ userId }).select("destination isPublic regenerateCount createdAt"),
    Feedback.find({ userId }).populate("storyId", "destination"),
    History.find({ userId }).sort({ createdAt: -1 }),
  ]);

  res.status(200).json(
    new ApiResponse(200, {
      user,
      stories,
      feedbacks,
      history,
    }, "User details fetched")
  );
});