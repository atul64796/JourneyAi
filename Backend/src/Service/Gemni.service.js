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
  try {
    // 1️⃣ Build prompt
    const prompt = PromptBuilder.buildStoryPrompt({
      destination,
      duration,
      mood,
      language,
      templateStyle,
    });

    // 2️⃣ Generate story text
    const textResult = await client.models.generateContent({
      model: TEXT_MODEL,
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    const storyText =
      textResult?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    if (!storyText || storyText.length < 50) {
      throw new Error("AI failed to generate a valid story");
    }

    // 3️⃣ Fetch 5 Unsplash images
    const imagesData = await getUnsplashImagesService({
      query: `${destination} travel`,
      count: 5,
    });

    // 4️⃣ Save story
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

    return story;
  } catch (err) {
    console.error("Create Story Error:", err.message);
    throw err;
  }
};


// REGENERATE STORY

export const regenerateStoryService = async (storyId) => {
  try {
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

    // Regenerate text
    const textResult = await client.models.generateContent({
      model: TEXT_MODEL,
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    const newStoryText =
      textResult?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    if (!newStoryText || newStoryText.length < 50) {
      throw new Error("AI failed to regenerate story");
    }

    // refresh images
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
  } catch (err) {
    console.error("Regenerate Story Error:", err.message);
    throw err;
  }
};

//toggle visbilty
export const toggleStoryVisibilityService = async (storyId, isPublic) => {
  const updatedStory = await Story.findByIdAndUpdate(
    storyId,
    { isPublic },
    { new: true }
  );

  if (!updatedStory) throw new Error("Story not found");
  return updatedStory;
};
