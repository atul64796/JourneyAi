import express from "express";
import {
  createStory,
  getPublicStories,
  getStoryById,
  regenerateStory,
  toggleStoryVisibility,
  getUserStoryStats,
  getAllStoriesForAdmin,
  getUserStorySummaryForAdmin, // <-- Added this import
} from "../controllers/story.controller.js";

import { verifyJwt } from "../middlewares/authmiddleware.js";
import { optionalAuth } from "../middlewares/optionalAuth.middleware.js";
import { adminOnly } from "../middlewares/adminOnly.middleware.js";
import History from "../models/historySchema.js";

const router = express.Router();

/* ================= PUBLIC ROUTES ================= */

/* -------- PUBLIC STORIES -------- */
router.get("/public", getPublicStories);

/* ================= USER ROUTES ================= */

/* -------- USER STORY STATS -------- */
router.get("/stats", verifyJwt, getUserStoryStats);

/* -------- CREATE STORY -------- */
router.post("/", verifyJwt, async (req, res, next) => {
  try {
    await createStory(req, res);

    await History.create({
      userId: req.user._id,
      action: "create",
    });
  } catch (err) {
    next(err);
  }
});

/* -------- REGENERATE STORY -------- */
router.post("/:storyId/regenerate", verifyJwt, async (req, res, next) => {
  try {
    await regenerateStory(req, res);

    await History.create({
      userId: req.user._id,
      storyId: req.params.storyId,
      action: "regenerate",
    });
  } catch (err) {
    next(err);
  }
});

/* -------- TOGGLE VISIBILITY -------- */
router.patch("/:storyId/visibility", verifyJwt, async (req, res, next) => {
  try {
    await toggleStoryVisibility(req, res);

    await History.create({
      userId: req.user._id,
      storyId: req.params.storyId,
      action: "visibility_change",
    });
  } catch (err) {
    next(err);
  }
});

/* -------- GET STORY BY ID -------- */
router.get("/:id", optionalAuth, getStoryById);

/* ================= ADMIN ROUTES ================= */


/* -------- ADMIN: ALL STORIES -------- */
router.get(
  "/admin/all",
  verifyJwt,
  adminOnly,
  getAllStoriesForAdmin
);

/* -------- ADMIN: USER ACTIVITY SUMMARY -------- */

router.get("/admin/user-summary",verifyJwt,adminOnly,getUserStorySummaryForAdmin);

export default router;