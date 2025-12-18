import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import History from "../models/historySchema.js";

/**
 * POST /j1/v1/history
 */
export const createHistory = asyncHandler(async (req, res) => {
  const { storyId, action, regenerateCount = 0 } = req.body;

  const history = await History.create({
    userId: req.user._id,
    storyId,
    action,
    regenerateCount,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, history, "History created successfully"));
});

/**
 * GET /j1/v1/history
 */

export const getUserHistory = asyncHandler(async (req, res) => {
  const history = await History.find({ userId: req.user._id })
    .populate({
      path: "userId",
      select: "fullName avatar",
    })
    .populate({
      path: "storyId",
      select: "destination mood duration language storyText createdAt",
    })
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, history, "History fetched successfully"));
});


/**
 * DELETE /j1/v1/history/:id
 */
export const deleteHistory = asyncHandler(async (req, res) => {
  const history = await History.findOneAndDelete({
    _id: req.params.id,
    userId: req.user._id,
  });

  if (!history) {
    return res
      .status(404)
      .json(new ApiResponse(404, null, "History not found"));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, null, "History deleted successfully"));
});
