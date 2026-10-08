import api from "./api";

export const bookAppointment = async (symptom, painStage) => {
  const res = await api.post("/patient/book", { symptom, painStage });
  return res.data;
};

export const getMyAppointment = async () => {
  const res = await api.get("/patient/my-appointment");
  return res.data;
};

export const getPatientHistory = async () => {
  const res = await api.get("/patient/history");
  return res.data;
};