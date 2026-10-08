import { useState, useEffect, useCallback } from "react";
import DashboardLayout from "../../components/common/DashboardLayout.jsx";
import { bookAppointment, getMyAppointment } from "../../services/patientService.js";
import { SYMPTOM_LIST, PAIN_STAGES } from "../../utils/constants.js";

const POLL_INTERVAL = 8000;

const PatientDashboard = () => {
  const [existingAppointment, setExistingAppointment] = useState(null);
  const [loading, setLoading] = useState(true);

  const [symptom, setSymptom] = useState("");
  const [painStage, setPainStage] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const loadAppointment = useCallback(async () => {
    try {
      const data = await getMyAppointment();
      setExistingAppointment(data);
    } catch (err) {
      setExistingAppointment(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAppointment();
    const interval = setInterval(loadAppointment, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [loadAppointment]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!symptom || !painStage) {
      setError("Please select a symptom and pain stage.");
      return;
    }
    setSubmitting(true);
    try {
      const data = await bookAppointment(symptom, painStage);
      setExistingAppointment(data);
      setSuccess(true);
      setSymptom("");
      setPainStage("");
    } catch (err) {
      setError(err.response?.data?.message || "Booking failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Book Appointment">
        <div className="text-textMuted">Loading...</div>
      </DashboardLayout>
    );
  }

  if (existingAppointment) {
    const statusLabel = {
      booked: "Booked — waiting for evening sorting",
      sorted: "Slot confirmed — arrive within your check-in window",
      checked_in: "Checked in — vitals recorded, waiting for doctor",
    };

    const statusColor = {
      booked: "text-textMuted",
      sorted: "text-primary",
      checked_in: "text-severity-medium",
    };

    return (
      <DashboardLayout title="Book Appointment" subtitle="Your current booking status — updates automatically">
        <div className="max-w-2xl">
          {success && (
            <div className="bg-green-50 border border-green-200 text-severity-low rounded-lg px-4 py-3 text-sm mb-6">
              ✓ Appointment booked successfully.
            </div>
          )}

          <div className="bg-surface border border-border rounded-xl overflow-hidden">
            <div className="px-6 py-5 border-b border-border">
              <h2 className="font-heading text-lg font-semibold text-textDark">
                {existingAppointment.symptom}
              </h2>
              <p className="text-sm text-textMuted">
                Pain stage: {existingAppointment.painStage} · Booked for {existingAppointment.bookingDate}
              </p>
            </div>

            <div className="px-6 py-5 grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-textMuted mb-1">Status</p>
                <p className={`font-medium ${statusColor[existingAppointment.status]}`}>
                  {statusLabel[existingAppointment.status]}
                </p>
              </div>
              <div>
                <p className="text-xs text-textMuted mb-1">Queue number</p>
                <p className="text-textDark font-medium">
                  {existingAppointment.queueNo ? `#${existingAppointment.queueNo}` : "Assigned in the evening"}
                </p>
              </div>
              <div>
                <p className="text-xs text-textMuted mb-1">Your check-in time</p>
                <p className="text-textDark font-medium">
                  {existingAppointment.slot || "Assigned in the evening"}
                </p>
              </div>
              <div>
                <p className="text-xs text-textMuted mb-1">Severity</p>
                <p className="text-textDark font-medium">{existingAppointment.severity}</p>
              </div>
            </div>

            {existingAppointment.status === "sorted" && (
              <div className="px-6 py-4 border-t border-border bg-primary/5">
                <p className="text-sm text-textDark">
                  <span className="font-medium text-primary">Morning check-in window: 9:00 AM – 9:30 AM.</span>{" "}
                  Please arrive close to your check-in time above so the nurse can record your vitals in order.
                </p>
              </div>
            )}

            {existingAppointment.vitalsEntered && (
              <div className="px-6 py-4 border-t border-border bg-background/50">
                <p className="text-sm text-textDark">
                  <span className="text-severity-low font-medium">✓ Vitals recorded</span> — BP {existingAppointment.bp}, Temp {existingAppointment.temp}. Your consultation is next.
                </p>
              </div>
            )}
          </div>

          <p className="text-xs text-textMuted mt-4">
            This page checks for updates automatically — no need to refresh.
          </p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Book Appointment" subtitle="Registration closes at 5:00 PM or once 200 slots fill">
      <div className="max-w-xl">
        <div className="bg-surface border border-border rounded-xl p-8">
          <h2 className="font-heading text-xl font-semibold text-textDark mb-2">
            Tell us how you're feeling
          </h2>
          <p className="text-textMuted mb-6">
            We'll assign your slot this evening based on severity, waiting time, and age.
          </p>

          {error && (
            <div className="mb-5 text-sm text-severity-high bg-red-50 border border-red-200 rounded-lg px-4 py-3">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-textDark mb-2">Symptom</label>
              <select
                value={symptom}
                onChange={(e) => setSymptom(e.target.value)}
                className="w-full border border-border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition bg-white"
              >
                <option value="">Select a symptom</option>
                {SYMPTOM_LIST.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-textDark mb-2">Pain level</label>
              <div className="grid grid-cols-3 gap-3">
                {PAIN_STAGES.map((stage) => (
                  <button
                    type="button"
                    key={stage}
                    onClick={() => setPainStage(stage)}
                    className={`py-3 rounded-lg border text-sm font-medium transition ${
                      painStage === stage
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border text-textDark hover:bg-background"
                    }`}
                  >
                    {stage}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-primary text-white rounded-lg py-3 font-medium hover:bg-primary-dark transition disabled:opacity-60"
            >
              {submitting ? "Booking..." : "Submit Booking"}
            </button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PatientDashboard;