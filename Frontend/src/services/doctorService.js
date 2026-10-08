import api from "./api";

export const searchPatientForDoctor = async (email) => {
  const res = await api.get(`/doctor/search/${email}`);
  return res.data;
};

export const savePrescription = async (appointmentId, prescription) => {
  const res = await api.put(`/doctor/prescribe/${appointmentId}`, { prescription });
  return res.data;
};

export const getPastPrescriptions = async () => {
  const res = await api.get("/doctor/past-prescriptions");
  return res.data;
};