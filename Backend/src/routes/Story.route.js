import express from "express";
import {
  createStoryServices,
  regenerateStoryService,
  toggleStoryVisibilityService,
} from "../Service/Story.service.js";

import { getPublicStories ,getStoryById} from "../controllers/story.controller.js";
import { verifyJwt } from "../middlewares/authmiddleware.js";
import History from "../models/historySchema.js";

const router = express.Router();

/* ---------------- PUBLIC STORIES ---------------- */
router.get("/public", getPublicStories);

/* ---------------- CREATE STORY ---------------- */
router.post("/", verifyJwt, async (req, res) => {
  try {
    const story = await createStoryServices({
      userId: req.user._id,
      destination: req.body.destination,
      duration: req.body.duration,
      mood: req.body.mood,
      language: req.body.language,
      templateStyle: req.body.templateStyle,
      isPublic: req.body.isPublic,
    });

    // 🔥 CREATE HISTORY
    await History.create({
      userId: req.user._id,
      storyId: story._id,
      action: "create",
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

/* ---------------- REGENERATE STORY ---------------- */
router.post("/:storyId/regenerate", verifyJwt, async (req, res) => {
  try {
    const story = await regenerateStoryService(req.params.storyId);

    // 🔥 CREATE HISTORY
    await History.create({
      userId: req.user._id,
      storyId: story._id,
      action: "regenerate",
      regenerateCount: story.regenerateCount,
    });

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

/* ---------------- TOGGLE VISIBILITY ---------------- */
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

    // 🔥 OPTIONAL HISTORY (keep or remove)
    await History.create({
      userId: req.user._id,
      storyId: story._id,
      action: "visibility_change",
    });

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
//get your story id
router.get("/:id", verifyJwt, getStoryById);

export default router;
