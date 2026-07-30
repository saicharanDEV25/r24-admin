import api from "./api";

export const login = async (username, password) => {
  const response = await api.post("/auth/login", {
    username,
    password,
  });

  localStorage.setItem("token", response.data.token);

  return response.data;
};

export const logout = () => {
  localStorage.removeItem("token");
};

export const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};