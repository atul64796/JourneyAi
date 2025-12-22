import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import History from "../models/historySchema.js";
import { ApiError } from "../utils/ApiError.js";


export const createHistory = asyncHandler(async (req, res) => {
  const { storyId, action } = req.body;

  if (!action) {
    throw new ApiError(400, "Action is required for history logging");
  }

  const history = await History.create({
    userId: req.user._id,
    storyId: storyId || null, // storyId is now optional to prevent crashes
    action,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, history, "History record created successfully"));
});


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

export const deleteHistory = asyncHandler(async (req, res) => {
  const history = await History.findOneAndDelete({
    _id: req.params.id,
    userId: req.user._id, // Security:  users only delete their own data
  });

  if (!history) {
    return res
      .status(404)
      .json(new ApiResponse(404, null, "History record not found"));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, null, "History deleted successfully"));
});