import Appointment from "../models/Appointment.js";
import { sendEmail } from "../utils/sendEmail.js";

const DAILY_CAP = 200;
const painToSeverity = { Mild: "Low", Moderate: "Medium", Severe: "High" };

const getTomorrowDateString = () => {
  const d = new Date();
  return d.toISOString().split("T")[0];
};

export const bookAppointment = async (req, res) => {
  try {
    const { symptom, painStage } = req.body;
    const user = req.user;

    if (!symptom || !painStage) {
      return res.status(400).json({ message: "Symptom and pain stage are required" });
    }

    const bookingDate = getTomorrowDateString();

    const existing = await Appointment.findOne({
      email: user.email,
      bookingDate,
      status: { $ne: "completed" },
    });
    if (existing) {
      return res.status(400).json({ message: "You already have an active booking for today" });
    }

    const countToday = await Appointment.countDocuments({ bookingDate });
    if (countToday >= DAILY_CAP) {
      return res.status(400).json({ message: "Booking closed — daily limit reached" });
    }

    const appointment = await Appointment.create({
      patient: user.id,
      email: user.email,
      name: user.name,
      age: user.age,
      symptom,
      painStage,
      severity: painToSeverity[painStage] || "Low",
      bookingDate,
    });

    sendEmail(
      user.email,
      "CareQueue — Appointment Booked",
      `<h2>Hi ${user.name},</h2>
       <p>Your appointment has been booked for <strong>${bookingDate}</strong>.</p>
       <p><strong>Symptom:</strong> ${symptom}<br/>
       <strong>Pain level:</strong> ${painStage}</p>
       <p>Your queue number and time slot will be confirmed by <strong>6:00 PM today</strong>.</p>
       <p>— CareQueue OPD</p>`
    );

    res.status(201).json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyAppointment = async (req, res) => {
  try {
    const user = req.user;
    const appointment = await Appointment.findOne({
      email: user.email,
      status: { $ne: "completed" },
    })
      .sort({ createdAt: -1 })
      .limit(1);
    res.json(appointment || null);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPatientHistory = async (req, res) => {
  try {
    const user = req.user;
    const history = await Appointment.find({ email: user.email, status: "completed" }).sort({
      consultedAt: -1,
    });
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};