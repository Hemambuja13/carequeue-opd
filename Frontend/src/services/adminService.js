import api from "./api";

export const runSorting = async () => {
  const res = await api.post("/admin/run-sorting");
  return res.data;
};

export const getStats = async () => {
  const res = await api.get("/admin/stats");
  return res.data;
};

export const getTodayQueue = async () => {
  const res = await api.get("/admin/queue");
  return res.data;
};

export const getStaff = async () => {
  const res = await api.get("/admin/staff");
  return res.data;
};