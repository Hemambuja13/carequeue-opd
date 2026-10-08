import api from "./api";

export const loginUser = async (email, password) => {
  const res = await api.post("/auth/login", { email, password });
  return res.data;
};

export const registerPatient = async (formData) => {
  const res = await api.post("/auth/register", formData);
  return res.data;
};