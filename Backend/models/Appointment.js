import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    patient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    email: { type: String, required: true },
    name: { type: String, required: true },
    age: { type: Number, required: true },

    symptom: { type: String, required: true },
    painStage: { type: String, enum: ["Mild", "Moderate", "Severe"], required: true },
    severity: { type: String, enum: ["Low", "Medium", "High"], required: true },

    bookingDate: { type: String, required: true },

    queueNo: { type: Number },
    slot: { type: String },

    vitalsEntered: { type: Boolean, default: false },
    bp: { type: String, default: "" },
    temp: { type: String, default: "" },
    nurseNotes: { type: String, default: "" },

    status: {
      type: String,
      enum: ["booked", "sorted", "checked_in", "completed"],
      default: "booked",
    },
    prescription: { type: String, default: "" },
    consultedAt: { type: Date },
  },
  { timestamps: true }
);

const Appointment = mongoose.model("Appointment", appointmentSchema);
export default Appointment;