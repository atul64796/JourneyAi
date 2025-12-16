import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { createStoryServices } from "../Service/Gemni.service.js";

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
