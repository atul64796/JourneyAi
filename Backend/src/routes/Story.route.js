import express from "express";
import {
  createStoryServices,
  regenerateStoryService,
  toggleStoryVisibilityService,
} from "../Service/Gemni.service.js";

import { verifyJwt } from "../middlewares/authmiddleware.js";

const router = express.Router();

// ============================
// CREATE STORY (AUTH REQUIRED)
// ============================
router.post("/", verifyJwt, async (req, res) => {
  try {
    const story = await createStoryServices({
      userId: req.user._id, // ✅ FIXED (from JWT)
      destination: req.body.destination,
      duration: req.body.duration,
      mood: req.body.mood,
      language: req.body.language,
      templateStyle: req.body.templateStyle,
      isPublic: req.body.isPublic,
    });

    res.status(201).json({
      success: true,
      message: "Story created successfully",
      data: story,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
});

// ============================
// REGENERATE STORY
// ============================
router.post("/:storyId/regenerate", verifyJwt, async (req, res) => {
  try {
    const story = await regenerateStoryService(req.params.storyId);

    res.status(200).json({
      success: true,
      message: "Story regenerated successfully",
      data: story,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
});

// ============================
// TOGGLE STORY VISIBILITY
// ============================
router.patch("/:storyId/visibility", verifyJwt, async (req, res) => {
  try {
    const { isPublic } = req.body;

    if (typeof isPublic !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "isPublic must be boolean",
      });
    }

    const story = await toggleStoryVisibilityService(
      req.params.storyId,
      isPublic
    );

    res.status(200).json({
      success: true,
      message: "Story visibility updated",
      data: story,
    });
  } catch (err) {
    res.status(404).json({
      success: false,
      message: err.message,
    });
  }
});

export default router;
