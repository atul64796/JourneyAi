import api from "../services/api";

export const createFeedback = (data) => {
  const token = localStorage.getItem("accessToken");

  return api.post("/feedback", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getMyFeedback = () => {
  const token = localStorage.getItem("accessToken");

  return api.post("/feedback/me", {}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const updateFeedback = (id, data) => {
  const token = localStorage.getItem("accessToken");

  return api.patch(`/feedback/${id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const deleteFeedback = (id) => {
  const token = localStorage.getItem("accessToken");

  return api.delete(`/feedback/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};


export const getSomeFeedback = () => {
  return api.get("feedback/getsomefeedback");
};