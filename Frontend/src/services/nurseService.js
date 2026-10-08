import api from "./api";

export const searchPatientByMobile = async (email) => {
  const res = await api.get(`/nurse/search/${email}`);
  return res.data;
};

export const saveVitals = async (appointmentId, vitals) => {
  const res = await api.put(`/nurse/vitals/${appointmentId}`, vitals);
  return res.data;
};

export const getTodayQueue = async () => {
  const res = await api.get("/nurse/today-queue");
  return res.data;
};