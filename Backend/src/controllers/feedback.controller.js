import mongoose from "mongoose";
import Feedback from "../models/feedbackSchema.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";

/* =========================
   CREATE FEEDBACK (USER)
========================= */
export const createFeedback = asyncHandler(async (req, res) => {
  const { storyId, rating, comment, sentiment } = req.body;

  if (!storyId) {
    throw new ApiError(400, "Story ID is required");
  }

  if (!mongoose.Types.ObjectId.isValid(storyId)) {
    throw new ApiError(400, "Invalid story ID");
  }

  const feedback = await Feedback.create({
    user: req.user._id,
    storyId,
    rating,
    comment,
    sentiment,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, feedback, "Feedback created successfully"));
});

/* =========================
   GET MY FEEDBACKS (USER)
========================= */
export const getMyFeedback = asyncHandler(async (req, res) => {
  const feedbacks = await Feedback.find({ user: req.user._id })
    .populate("storyId", "destination mood","fullName avatar")
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(
      new ApiResponse(200, feedbacks, "My feedbacks fetched successfully")
    );
});

/* =========================
   UPDATE FEEDBACK (USER)
========================= */
export const updateFeedback = asyncHandler(async (req, res) => {
  const { feedbackId } = req.params;
  const { rating, comment, sentiment } = req.body;

  if (!mongoose.Types.ObjectId.isValid(feedbackId)) {
    throw new ApiError(400, "Invalid feedback ID");
  }

  const feedback = await Feedback.findOne({
    _id: feedbackId,
    user: req.user._id,
  });

  if (!feedback) {
    throw new ApiError(404, "Feedback not found or unauthorized");
  }

  if (rating !== undefined) feedback.rating = rating;
  if (comment !== undefined) feedback.comment = comment;
  if (sentiment !== undefined) feedback.sentiment = sentiment;

  await feedback.save();

  return res
    .status(200)
    .json(new ApiResponse(200, feedback, "Feedback updated successfully"));
});

/* =========================
   DELETE FEEDBACK (USER)
========================= */
export const deleteFeedback = asyncHandler(async (req, res) => {
  const { feedbackId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(feedbackId)) {
    throw new ApiError(400, "Invalid feedback ID");
  }

  const feedback = await Feedback.findOneAndDelete({
    _id: feedbackId,
    user: req.user._id,
  });

  if (!feedback) {
    throw new ApiError(404, "Feedback not found or unauthorized");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Feedback deleted successfully"));
});

export const getSomeFeedbacktoUser = asyncHandler(async (req, res) => {
  const feedbacks = await Feedback.find()
    .populate("user", "fullName avatar") // ✅ fixed
    .populate("storyId", "destination")
    .sort({ createdAt: -1 })
    

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        feedbacks,
        "Latest 7 feedback fetched successfully"
      )
    );
});





/* =========================
   GET ALL FEEDBACKS (ADMIN)
========================= */


export const getAllFeedback = asyncHandler(async (req, res) => {
  const feedbacks = await Feedback.find()
    // CHANGE THIS LINE: Add fullName and avatar
    .populate("user", "fullName avatar email") 
    .populate("storyId", "destination")
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, feedbacks, "All feedback fetched successfully"));
});

/* =========================
   RESPOND TO FEEDBACK (ADMIN)
========================= */
export const respondToFeedback = asyncHandler(async (req, res) => {
  const { feedbackId } = req.params;
  const { response, status } = req.body;

  if (!mongoose.Types.ObjectId.isValid(feedbackId)) {
    throw new ApiError(400, "Invalid feedback ID");
  }

  const feedback = await Feedback.findById(feedbackId);

  if (!feedback) {
    throw new ApiError(404, "Feedback not found");
  }

  feedback.response = response;
  feedback.status = status || "reviewed";

  await feedback.save();

  return res
    .status(200)
    .json(
      new ApiResponse(200, feedback, "Feedback responded successfully")
    );
});

/* =========================
   DELETE FEEDBACK (ADMIN)
========================= */
export const adminDeleteFeedback = asyncHandler(async (req, res) => {
  const { feedbackId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(feedbackId)) {
    throw new ApiError(400, "Invalid feedback ID");
  }

  const feedback = await Feedback.findByIdAndDelete(feedbackId);

  if (!feedback) {
    throw new ApiError(404, "Feedback not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Feedback removed by admin"));
});

