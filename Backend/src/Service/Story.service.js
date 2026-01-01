import OpenAI from "openai";
import PromptBuilder from "../utils/Prompt.Builder.js";
import Story from "../models/Story.schema.js";
import { getUnsplashImagesService } from "./unsplash.service.js";
import { ApiError } from "../utils/ApiError.js";

/* ------------------------------------------------------------------ */
/* GROQ CLIENT CONFIG */
/* ------------------------------------------------------------------ */

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
  timeout: 30000,
});

const TEXT_MODEL = "llama-3.1-8b-instant";

/* ------------------------------------------------------------------ */
/* HELPERS */
/* ------------------------------------------------------------------ */

const extractTextFromResponse = (response) => {
  // FIXED: Groq/OpenAI response format uses choices[0].message.content
  return response?.choices?.[0]?.message?.content?.trim() || "";
};

const callGroqWithRetry = async (prompt, retries = 2) => {
  try {
    
    const response = await client.chat.completions.create({
      model: TEXT_MODEL,
      messages: [{ role: "user", content: prompt }],
    });

    return extractTextFromResponse(response);
  } catch (err) {
    // Retry on Rate Limit (429) or Gateway/Service errors (502, 503)
    if ([429, 502, 503].includes(err.status) && retries > 0) {
      await new Promise((r) => setTimeout(r, 2000));
      return callGroqWithRetry(prompt, retries - 1);
    }

    if (err.code === "ETIMEDOUT") {
      throw new ApiError(504, "AI request timed out. Please try again.");
    }

    throw new ApiError(err.status || 500, err.message || "AI service is currently busy.");
  }
};

/* ------------------------------------------------------------------ */
/* CREATE STORY */
/* ------------------------------------------------------------------ */

export const createStoryServices = async ({
  userId,
  destination,
  duration,
  mood,
  language,
  templateStyle,
  isPublic = false,
}) => {
  if (!userId || !destination) {
    throw new ApiError(400, "UserId and Destination are required");
  }

  const prompt = PromptBuilder.buildStoryPrompt({
    destination,
    duration,
    mood,
    language,
    templateStyle,
  });

  const storyText = await callGroqWithRetry(prompt);

  if (!storyText || storyText.length < 100) {
    throw new ApiError(502, "AI failed to generate a valid story");
  }

  let imagesData = [];
  try {
    imagesData = await getUnsplashImagesService({
      query: `${destination} travel`,
      count: 5,
    });
  } catch {
    imagesData = [];
  }

  const story = await Story.create({
    userId,
    destination,
    duration,
    mood,
    language,
    templateStyle,
    storyText,
    isPublic,
    regenerateCount: 0,
    imageUrl: imagesData[0]?.imageUrl || "",
    images: imagesData.map((img) => img.imageUrl),
    imagePrompt: `${destination} travel`,
  });

  if (!story) throw new ApiError(500, "Failed to save story");

  return story;
};

/* ------------------------------------------------------------------ */
/* REGENERATE STORY */
/* ------------------------------------------------------------------ */

export const regenerateStoryService = async (storyId) => {
  if (!storyId) throw new ApiError(400, "StoryId is required");

  const story = await Story.findById(storyId);
  if (!story) throw new ApiError(404, "Story not found");

  if (story.regenerateCount >= 5) {
    throw new ApiError(429, "Regeneration limit reached (Max 5)");
  }

  const prompt = PromptBuilder.buildStoryPrompt({
    destination: story.destination,
    duration: story.duration,
    mood: story.mood,
    language: story.language,
    templateStyle: story.templateStyle,
  });

  const newStoryText = await callGroqWithRetry(prompt);

  if (!newStoryText || newStoryText.length < 100) {
    throw new ApiError(502, "AI failed to regenerate story");
  }

  // Optional: Refresh images during regeneration
  let imagesData = [];
  try {
    imagesData = await getUnsplashImagesService({
      query: `${story.destination} travel culture`,
      count: 3,
    });
  } catch {
    imagesData = [];
  }

  story.storyText = newStoryText;
  story.regenerateCount += 1;

  if (imagesData.length) {
    story.images = imagesData.map((img) => img.imageUrl);
    story.imageUrl = imagesData[0]?.imageUrl;
  }

  await story.save();
  return story;
};

/* ------------------------------------------------------------------ */
/* TOGGLE VISIBILITY */
/* ------------------------------------------------------------------ */

export const toggleStoryVisibilityService = async (storyId, isPublic) => {
  if (!storyId) throw new ApiError(400, "StoryId is required");

  const story = await Story.findByIdAndUpdate(
    storyId,
    { isPublic },
    { new: true }
  );

  if (!story) throw new ApiError(404, "Story not found");

  return story;
};