import { GoogleGenAI } from "@google/genai";
import PromptBuilder from "../utils/Prompt.Builder.js";
import Story from "../models/Story.schema.js";

const client = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const MODEL_NAME = "gemini-2.5-flash";

//Create a new story
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
    const prompt = PromptBuilder.buildStoryPrompt({
      destination,
      duration,
      mood,
      language,
      templateStyle,
    });

    const result = await client.models.generateContent({
      model: MODEL_NAME,
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    const storyText =
      result?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    if (!storyText || storyText.length < 50) {
      throw new Error("AI failed to generate a valid story");
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
    });

    return story;
  } catch (err) {
    console.error("Create Story Error:", err.message);
    throw err;
  }
};

//Regenerate an existing story

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

    const result = await client.models.generateContent({
      model: MODEL_NAME,
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    const newStoryText =
      result?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    if (!newStoryText || newStoryText.length < 50) {
      throw new Error("AI failed to generate a valid story");
    }

    story.storyText = newStoryText;
    story.regenerateCount += 1;

    await story.save();
    return story;
  } catch (err) {
    console.error("Regenerate Story Error:", err.message);
    throw err;
  }
};

//Toggle public/private visibility

export const toggleStoryVisibilityService = async (storyId, isPublic) => {
  const updatedStory = await Story.findByIdAndUpdate(
    storyId,
    { isPublic },
    { new: true }
  );

  if (!updatedStory) throw new Error("Story not found");
  return updatedStory;
};
