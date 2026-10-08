import { useState, useEffect, useCallback } from "react";
import DashboardLayout from "../../components/common/DashboardLayout.jsx";
import SeverityTag from "../../components/common/SeverityTag.jsx";
import { searchPatientForDoctor, savePrescription, getPastPrescriptions } from "../../services/doctorService.js";

const DoctorDashboard = () => {
  const [email, setEmail] = useState("");
  const [found, setFound] = useState(null);
  const [error, setError] = useState("");
  const [prescriptionText, setPrescriptionText] = useState("");
  const [pastPrescriptions, setPastPrescriptions] = useState([]);
  const [saved, setSaved] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const loadPastPrescriptions = useCallback(async () => {
    try {
      const data = await getPastPrescriptions();
      setPastPrescriptions(data);
    } catch (err) {
      // silent fail
    }
  }, []);

  useEffect(() => {
    loadPastPrescriptions();
  }, [loadPastPrescriptions]);

  const handleSearch = async (e) => {
    e.preventDefault();
    setSaved(false);
    setError("");
    setPrescriptionText("");
    try {
      const data = await searchPatientForDoctor(email.trim());
      setFound(data);
    } catch (err) {
      setFound(null);
      setError(err.response?.data?.message || "Patient not found.");
    }
  };

  const handleSavePrescription = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await savePrescription(found._id, prescriptionText);
      setSaved(true);
      loadPastPrescriptions();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save prescription.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout title="Search Patient" subtitle="Look up a patient to view vitals and give a prescription">
      <div className="max-w-3xl">
        <form onSubmit={handleSearch} className="flex gap-3 mb-8">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter patient's email address"
            className="flex-1 border border-border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
          />
          <button type="submit" className="bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-dark transition">
            🔍 Search
          </button>
        </form>

        {error && (
          <div className="bg-red-50 border border-red-200 text-severity-high rounded-lg px-4 py-3 text-sm mb-8">
            {error}
          </div>
        )}

        {found && (
          <div className="bg-surface border border-border rounded-xl overflow-hidden mb-10">
            <div className="px-6 py-5 border-b border-border flex items-center justify-between">
              <div>
                <h2 className="font-heading text-lg font-semibold text-textDark">{found.name}</h2>
                <p className="text-sm text-textMuted">Age {found.age} · {found.email}</p>
              </div>
              <SeverityTag level={found.severity} />
            </div>

            <div className="px-6 py-5 grid grid-cols-2 sm:grid-cols-4 gap-4 border-b border-border">
              <div>
                <p className="text-xs text-textMuted mb-1">Symptom</p>
                <p className="text-textDark font-medium">{found.symptom}</p>
              </div>
              <div>
                <p className="text-xs text-textMuted mb-1">Pain stage</p>
                <p className="text-textDark font-medium">{found.painStage}</p>
              </div>
              <div>
                <p className="text-xs text-textMuted mb-1">Blood Pressure</p>
                <p className="text-textDark font-medium">{found.bp || "—"}</p>
              </div>
              <div>
                <p className="text-xs text-textMuted mb-1">Temperature</p>
                <p className="text-textDark font-medium">{found.temp || "—"}</p>
              </div>
            </div>

            {found.status === "completed" ? (
              <div className="px-6 py-5">
                <div className="bg-green-50 border border-green-200 text-severity-low rounded-lg px-4 py-3 text-sm">
                  ✓ This appointment is already completed. Prescription: {found.prescription}
                </div>
              </div>
            ) : (
              <form onSubmit={handleSavePrescription} className="px-6 py-5 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-textDark mb-2">Prescription</label>
                  <textarea
                    required
                    rows={5}
                    value={prescriptionText}
                    onChange={(e) => setPrescriptionText(e.target.value)}
                    placeholder="Write diagnosis, medication, and advice..."
                    className="w-full border border-border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                  />
                </div>
                <button type="submit" disabled={submitting} className="w-full bg-primary text-white rounded-lg py-3 font-medium hover:bg-primary-dark transition disabled:opacity-60">
                  {submitting ? "Saving..." : "Save & Complete Appointment"}
                </button>
              </form>
            )}

            {saved && (
              <div className="px-6 pb-6">
                <div className="bg-green-50 border border-green-200 text-severity-low rounded-lg px-4 py-3 text-sm">
                  ✓ Prescription saved. Appointment marked complete.
                </div>
              </div>
            )}
          </div>
        )}

        {!found && !error && (
          <div className="bg-surface border border-border rounded-xl p-10 text-center text-textMuted mb-10">
            Search a patient's email address to view their vitals and add a prescription.
          </div>
        )}

        <div className="bg-surface border border-border rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-border flex items-center justify-between">
            <h2 className="font-heading font-semibold text-textDark">Past prescriptions</h2>
            <span className="text-sm text-textMuted">{pastPrescriptions.length} total</span>
          </div>
          {pastPrescriptions.length === 0 ? (
            <div className="p-10 text-center text-textMuted">No prescriptions given yet.</div>
          ) : (
            <div className="divide-y divide-border">
              {pastPrescriptions.map((p) => (
                <div key={p._id} className="px-6 py-5">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium text-textDark">{p.name}</p>
                    <span className="text-xs text-textMuted">
                      {new Date(p.consultedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </span>
                  </div>
                  <p className="text-sm text-textMuted mb-2">{p.email} · {p.symptom}</p>
                  <p className="text-sm text-textDark bg-background rounded-lg px-4 py-3">{p.prescription}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DoctorDashboard;