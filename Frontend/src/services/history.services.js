import api from "../services/api";

// CREATE HISTORY
export const createHistory = async (data) => {
  const response = await api.post("/history", data);
  return response.data;
};

// GET USER HISTORY
export const getUserHistory = async () => {
  const response = await api.get("/history");
  return response.data;
};

// DELETE HISTORY
export const deleteHistory = async (id) => {
  const response = await api.delete(`/history/${id}`);
  return response.data;
};
