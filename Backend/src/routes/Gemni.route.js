import express from "express";
import {
  createStoryServices,
  regenerateStoryService,
  toggleStoryVisibilityService,
} from "../Service/GemniService.js";

const router = express.Router();


router.post("/", async (req, res) => {
  try {
    const story = await createStoryServices({
      userId: req.body.userId,   // ✅ FIX
      destination: req.body.destination,
      duration: req.body.duration,
      mood: req.body.mood,
      language: req.body.language,
      templateStyle: req.body.templateStyle,
      isPublic: req.body.isPublic,
    });

    res.status(201).json({ success: true, data: story });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});



router.post("/:storyId/regenerate", async (req, res) => {
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


router.patch("/:storyId/visibility", async (req, res) => {
  try {
    const { isPublic } = req.body;

    if (typeof isPublic !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "isPublic must be a boolean",
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
