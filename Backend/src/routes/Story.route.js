import express from "express";
import {
  createStory,
  getPublicStories,
  getStoryById,
  regenerateStory,
  toggleStoryVisibility,
  getUserStoryStats,
  getAllStoriesForAdmin,
  getUserStorySummaryForAdmin,
} from "../controllers/story.controller.js";

import { verifyJwt } from "../middlewares/authmiddleware.js";
import { optionalAuth } from "../middlewares/optionalAuth.middleware.js";
import { adminOnly } from "../middlewares/adminOnly.middleware.js";

const router = express.Router();

/* ================= PUBLIC ROUTES ================= */
router.get("/public", getPublicStories);

/* ================= USER ROUTES ================= */

/* -------- USER STORY STATS -------- */
router.get("/stats", verifyJwt, getUserStoryStats);

/* -------- CREATE STORY -------- */
// Cleaned: History logic moved to the createStory controller
router.post("/", verifyJwt, createStory);

/* -------- REGENERATE STORY -------- */
// Cleaned: History logic moved to the regenerateStory controller
router.post("/:storyId/regenerate", verifyJwt, regenerateStory);

/* -------- TOGGLE VISIBILITY -------- */
// Cleaned: History logic moved to the toggleStoryVisibility controller
router.patch("/:storyId/visibility", verifyJwt, toggleStoryVisibility);

/* -------- GET STORY BY ID -------- */
router.get("/:id", optionalAuth, getStoryById);

/* ================= ADMIN ROUTES ================= */

/* -------- ADMIN: ALL STORIES -------- */
router.get("/admin/all", verifyJwt, adminOnly, getAllStoriesForAdmin);

/* -------- ADMIN: USER ACTIVITY SUMMARY -------- */
router.get(
  "/admin/user-summary",
  verifyJwt,
  adminOnly,
  getUserStorySummaryForAdmin
);

export default router;