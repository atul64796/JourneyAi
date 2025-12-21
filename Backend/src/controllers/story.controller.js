import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import Story from "../models/Story.schema.js";
import {
  createStoryServices,
  regenerateStoryService,
  toggleStoryVisibilityService,
} from "../Service/Story.service.js";

/* =========================================================
   USER STORY CONTROLLERS
========================================================= */

/* ---------------- CREATE STORY ---------------- */
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

/* ---------------- GET PUBLIC STORIES ---------------- */
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

  res
    .status(200)
    .json(new ApiResponse(200, stories, "Public stories fetched"));
});

export const getStoryById = asyncHandler(async (req, res) => {
  const story = await Story.findById(req.params.id)
    .populate("userId", "fullName avatar");

  if (!story) {
    return res
      .status(404)
      .json(new ApiResponse(404, null, "Story not found"));
  }

  // ✅ Public story → allow everyone
  if (story.isPublic) {
    return res
      .status(200)
      .json(new ApiResponse(200, story, "Story fetched"));
  }

  // ❌ Private + not logged in
  if (!req.user) {
    return res
      .status(401)
      .json(new ApiResponse(401, null, "Login required"));
  }

  // ❌ Private + not owner + not admin
  if (
    story.userId._id.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    return res
      .status(403)
      .json(new ApiResponse(403, null, "Access denied"));
  }

  // ✅ Owner or admin
  res
    .status(200)
    .json(new ApiResponse(200, story, "Story fetched"));
});

/* ---------------- REGENERATE STORY ---------------- */
export const regenerateStory = asyncHandler(async (req, res) => {
  const story = await regenerateStoryService(req.params.storyId);

  res
    .status(200)
    .json(new ApiResponse(200, story, "Story regenerated successfully"));
});

/* ---------------- TOGGLE VISIBILITY ---------------- */
export const toggleStoryVisibility = asyncHandler(async (req, res) => {
  const { isPublic } = req.body;

  if (typeof isPublic !== "boolean") {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "isPublic must be boolean"));
  }

  const story = await toggleStoryVisibilityService(
    req.params.storyId,
    isPublic
  );

  res
    .status(200)
    .json(new ApiResponse(200, story, "Story visibility updated"));
});

/* ---------------- USER STORY STATS ---------------- */
export const getUserStoryStats = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const stats = await Story.aggregate([
    { $match: { userId } },
    {
      $group: {
        _id: "$userId",
        totalStories: { $sum: 1 },
        publicStories: { $sum: { $cond: ["$isPublic", 1, 0] } },
        privateStories: { $sum: { $cond: ["$isPublic", 0, 1] } },
      },
    },
  ]);

  res.status(200).json(
    new ApiResponse(
      200,
      stats[0] || {
        totalStories: 0,
        publicStories: 0,
        privateStories: 0,
      },
      "User story stats fetched"
    )
  );
});

/* =========================================================
   ADMIN CONTROLLERS
========================================================= */

/* ---------------- ADMIN: GET ALL STORIES ---------------- */
export const getAllStoriesForAdmin = asyncHandler(async (req, res) => {
  const stories = await Story.find()
    .populate("userId", "email fullName avatar")
    .sort({ createdAt: -1 })
    .select(
      "destination duration mood language isPublic regenerateCount createdAt userId"
    );

  res.status(200).json(
    new ApiResponse(200, stories, "All stories fetched for admin")
  );
});

/* ---------------- ADMIN: GET STORIES BY USER ---------------- */
export const getStoriesByUserForAdmin = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const stories = await Story.find({ userId })
    .sort({ createdAt: -1 })
    .select("destination isPublic regenerateCount createdAt");

  res.status(200).json(
    new ApiResponse(200, stories, "User stories fetched for admin")
  );
});

/* =========================================================
   ADMIN: USER STORY SUMMARY (UNCHANGED, WORKING)
========================================================= */

export const getUserStorySummaryForAdmin = asyncHandler(async (req, res) => {
  const summary = await Story.aggregate([
    {
      $group: {
        _id: "$userId",
        totalStories: { $sum: 1 },
        publicCount: {
          $sum: { $cond: [{ $eq: ["$isPublic", true] }, 1, 0] },
        },
        privateCount: {
          $sum: { $cond: [{ $eq: ["$isPublic", false] }, 1, 0] },
        },
        lastActivity: { $max: "$createdAt" },
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "userDetails",
      },
    },
    { $unwind: "$userDetails" },
    {
      $project: {
        _id: 1,
        totalStories: 1,
        publicCount: 1,
        privateCount: 1,
        lastActivity: 1,
        "userDetails.email": 1,
        "userDetails.fullName": 1,
        "userDetails.avatar": 1,
        "userDetails.isBanned": 1,
      },
    },
    { $sort: { totalStories: -1 } },
  ]);

  res.status(200).json(
    new ApiResponse(200, summary, "User activity summary fetched successfully")
  );
});
