import Appointment from "../models/Appointment.js";
import User from "../models/User.js";
import { assignQueueAndSlots } from "../utils/sortQueue.js";
import { sendEmail } from "../utils/sendEmail.js";

const getTodayDateString = () => new Date().toISOString().split("T")[0];

export const runSorting = async (req, res) => {
  try {
    const today = getTodayDateString();
    const appointments = await Appointment.find({ bookingDate: today, status: "booked" });

    if (appointments.length === 0) {
      return res.status(400).json({ message: "No pending bookings to sort for today." });
    }

    const assignments = assignQueueAndSlots(appointments);

    await Promise.all(
      assignments.map(async (a) => {
        const updated = await Appointment.findByIdAndUpdate(
          a._id,
          { queueNo: a.queueNo, slot: a.slot, status: "sorted" },
          { new: true }
        );

        sendEmail(
          updated.email,
          "CareQueue — Your Appointment Slot Confirmed",
          `<h2>Hi ${updated.name},</h2>
           <p>Your OPD visit has been scheduled.</p>
           <p><strong>Queue number:</strong> #${updated.queueNo}<br/>
           <strong>Your check-in time:</strong> ${updated.slot}</p>
           <p><strong>Important:</strong> All patients must arrive within the morning check-in window of
           <strong>9:00 AM – 9:30 AM</strong>. Your check-in time above is your turn within that window —
           please try to arrive close to it so the nurse can take your vitals in order.</p>
           <p>After your vitals are recorded, you'll be seen by the doctor based on your position in the queue.</p>
           <p>— CareQueue OPD</p>`
        );
      })
    );

    res.json({ message: `Sorted ${assignments.length} appointments.`, count: assignments.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getStats = async (req, res) => {
  try {
    const today = getTodayDateString();
    const all = await Appointment.find({ bookingDate: today });

    const total = all.length;
    const checkedIn = all.filter((a) => a.vitalsEntered).length;
    const completed = all.filter((a) => a.status === "completed").length;
    const highSeverity = all.filter((a) => a.severity === "High").length;
    const pendingSort = all.filter((a) => a.status === "booked").length;

    res.json({ total, checkedIn, completed, highSeverity, pendingSort, cap: 200 });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTodayQueueForAdmin = async (req, res) => {
  try {
    const today = getTodayDateString();
    const appointments = await Appointment.find({ bookingDate: today }).sort({ queueNo: 1 });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  List nurse/doctor/admin staff accounts
// @route GET /api/admin/staff
export const getStaff = async (req, res) => {
  try {
    const staff = await User.find({ role: { $in: ["nurse", "doctor", "admin"] } })
      .select("-password")
      .sort({ role: 1, name: 1 });
    res.json(staff);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};