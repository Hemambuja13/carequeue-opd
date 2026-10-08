import Appointment from "../models/Appointment.js";

const getTodayDateString = () => new Date().toISOString().split("T")[0];

export const searchPatientForDoctor = async (req, res) => {
  try {
    const { email } = req.params;
    const today = getTodayDateString();

    const appointment = await Appointment.findOne({ email: email.toLowerCase(), bookingDate: today });
    if (!appointment) {
      return res.status(404).json({ message: "No appointment found for this email today" });
    }
    if (!appointment.vitalsEntered) {
      return res.status(400).json({ message: "Vitals not yet entered by nurse for this patient" });
    }
    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const savePrescription = async (req, res) => {
  try {
    const { prescription } = req.body;
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { prescription, status: "completed", consultedAt: new Date() },
      { new: true }
    );
    if (!appointment) return res.status(404).json({ message: "Appointment not found" });
    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPastPrescriptions = async (req, res) => {
  try {
    const prescriptions = await Appointment.find({ status: "completed" })
      .sort({ consultedAt: -1 })
      .limit(50);
    res.json(prescriptions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};