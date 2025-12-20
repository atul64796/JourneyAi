import api from "../services/api";

// CHAT WITH TRAVEL BOT
export const chatWithTravelBot = async ({
  message,
  chatHistory = [],
}) => {
  const token = localStorage.getItem("accessToken");

  const response = await api.post(
    "/chat/travel-chat",
    {
      message,
      chatHistory,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};
