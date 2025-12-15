import api from "../services/api"

export const createStory = async (storyData) => {
  const response = await api.post("/stories", storyData);
  return response.data;
};
