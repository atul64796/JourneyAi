import { travelChatbotService } from "../Service/travelChatbot.service.js";

export const chatTravelBot = async (req, res) => {
  try {
    const { message, chatHistory } = req.body;

    const reply = await travelChatbotService({
      userId: req.user.id,
      message,
      chatHistory,
    });

    res.status(200).json({
      success: true,
      reply,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
