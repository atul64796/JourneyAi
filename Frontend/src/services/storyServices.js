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


 
