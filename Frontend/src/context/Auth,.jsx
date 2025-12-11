// authService.js
import api, { TOKEN_KEY } from "../api";

const authService = {
  login: async (credentials) => {
    const res = await api.post("/user/login", credentials);

    // expect backend to return { accessToken, user }
    const { accessToken, user } = res.data.data;

    localStorage.setItem(TOKEN_KEY, accessToken);
    localStorage.setItem("user", JSON.stringify(user));

    return user;
  },

  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem("user");
  },

  getUser: () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },
};

export default authService;
