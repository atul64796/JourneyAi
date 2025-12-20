import OpenAI from "openai";
import buildTravelChatPrompt from "../utils/TravelChatPrompt.js";

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

const CHAT_MODEL = "moonshotai/kimi-k2-instruct";

export const travelChatbotService = async ({
  userId,
  message,
  chatHistory = [],
}) => {
  if (!userId || !message) {
    throw new Error("UserId and message are required");
  }

  const systemPrompt = buildTravelChatPrompt();

  const messages = [
    { role: "system", content: systemPrompt },
    ...chatHistory,
    { role: "user", content: message },
  ];

  const response = await client.responses.create({
    model: CHAT_MODEL,
    input: messages,
  });

  const reply = response.output_text?.trim();

  if (!reply) {
    throw new Error("No response from travel chatbot");
  }

  return reply;
};
