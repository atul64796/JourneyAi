import api from "../services/api";

export const createStory = async (storyData) => {
  const response = await api.post("/stories", storyData);
  return response.data;
};


  export const regenerateStory = async (id) => {
  const token = localStorage.getItem("accessToken");

  const response = await api.post(
    `/stories/${id}/regenerate`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data; 
};


// GET PUBLIC STORIES (NO AUTH REQUIRED)
export const getPublicStories = async (page = 1, limit = 10) => {
  const response = await api.get(
    `/stories/public?page=${page}&limit=${limit}`
  );
  return response.data;
};


 
