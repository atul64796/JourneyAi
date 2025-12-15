import { GoogleGenAI } from "@google/genai";
import PromptBuilder from "../utils/Prompt.Builder.js";
import Story from "../models/Story.schema.js";
import { getUnsplashImagesService } from "./unsplash.service.js";

const client = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const TEXT_MODEL = "gemini-2.5-flash";

// ============================
// CREATE STORY
// ============================
export const createStoryServices = async ({
  userId,
  destination,
  duration,
  mood,
  language,
  templateStyle,
  isPublic = false,
}) => {
  if (!userId) {
    throw new Error("UserId is required");
  }

  const prompt = PromptBuilder.buildStoryPrompt({
    destination,
    duration,
    mood,
    language,
    templateStyle,
  });

  const result = await client.models.generateContent({
    model: TEXT_MODEL,
    contents: [{ role: "user", parts: [{ text: prompt }] }],
  });

  const storyText =
    result?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

  if (!storyText || storyText.length < 50) {
    throw new Error("AI failed to generate a valid story");
  }

  const imagesData = await getUnsplashImagesService({
    query: `${destination} travel`,
    count: 5,
  });

  return await Story.create({
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
};

// ============================
// REGENERATE STORY
// ============================
export const regenerateStoryService = async (storyId) => {
  const story = await Story.findById(storyId);
  if (!story) throw new Error("Story not found");
  if (story.regenerateCount >= 5)
    throw new Error("Regeneration limit reached");

  const prompt = PromptBuilder.buildStoryPrompt({
    destination: story.destination,
    duration: story.duration,
    mood: story.mood,
    language: story.language,
    templateStyle: story.templateStyle,
  });

  const result = await client.models.generateContent({
    model: TEXT_MODEL,
    contents: [{ role: "user", parts: [{ text: prompt }] }],
  });

  const newStoryText =
    result?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

  if (!newStoryText || newStoryText.length < 50) {
    throw new Error("AI failed to regenerate story");
  }

  const imagesData = await getUnsplashImagesService({
    query: `${story.destination} travel`,
    count: 5,
  });

  story.storyText = newStoryText;
  story.images = imagesData.map((img) => img.imageUrl);
  story.imageUrl = imagesData[0]?.imageUrl || story.imageUrl;
  story.regenerateCount += 1;

  await story.save();
  return story;
};

// ============================
// TOGGLE VISIBILITY
// ============================
export const toggleStoryVisibilityService = async (storyId, isPublic) => {
  const story = await Story.findByIdAndUpdate(
    storyId,
    { isPublic },
    { new: true }
  );

  if (!story) throw new Error("Story not found");
  return story;
};
