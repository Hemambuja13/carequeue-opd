import Appointment from "../models/Appointment.js";

const getTodayDateString = () => new Date().toISOString().split("T")[0];

export const searchPatientByMobile = async (req, res) => {
  try {
    const { email } = req.params;
    const today = getTodayDateString();

    const appointment = await Appointment.findOne({ email: email.toLowerCase(), bookingDate: today });
    if (!appointment) {
      return res.status(404).json({ message: "No appointment found for this email today" });
    }
    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const saveVitals = async (req, res) => {
  try {
    const { bp, temp, nurseNotes } = req.body;
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { bp, temp, nurseNotes, vitalsEntered: true, status: "checked_in" },
      { new: true }
    );
    if (!appointment) return res.status(404).json({ message: "Appointment not found" });
    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTodayQueue = async (req, res) => {
  try {
    const today = getTodayDateString();
    const appointments = await Appointment.find({ bookingDate: today }).sort({ queueNo: 1 });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};