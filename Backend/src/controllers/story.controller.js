import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { createStoryServices } from "../Service/Story.service.js";

import Story from "../models/Story.schema.js"

export const createStory = asyncHandler(async (req, res) => {
  const story = await createStoryServices({
    userId: req.user._id,          
    destination: req.body.destination,
    duration: req.body.duration,
    mood: req.body.mood,
    language: req.body.language,
    templateStyle: req.body.templateStyle,
    isPublic: req.body.isPublic,
  });

  res
    .status(201)
    .json(new ApiResponse(201, story, "Story created successfully"));
});

export const getPublicStories = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const stories = await Story.find({ isPublic: true })
    .populate("userId", "fullName avatar")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .select("-__v");

  return res.status(200).json(
    new ApiResponse(200, stories, "Public stories fetched successfully")
  );
});


export const getStoryById = asyncHandler(async (req, res) => {
  const story = await Story.findById(req.params.id)
    .populate("userId", "fullName avatar");

  if (!story) {
    return res
      .status(404)
      .json(new ApiResponse(404, null, "Story not found"));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, story, "Story fetched successfully"));
});
