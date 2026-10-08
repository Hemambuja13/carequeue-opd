import { useState, useEffect } from "react";
import DashboardLayout from "../../components/common/DashboardLayout.jsx";
import SeverityTag from "../../components/common/SeverityTag.jsx";
import { getPatientHistory } from "../../services/patientService.js";

const PatientHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getPatientHistory();
        setHistory(data);
      } catch (err) {
        setHistory([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <DashboardLayout title="History & Prescriptions" subtitle="Your past appointments and prescriptions">
      {loading ? (
        <div className="text-textMuted">Loading...</div>
      ) : history.length === 0 ? (
        <div className="bg-surface border border-border rounded-xl p-10 text-center text-textMuted max-w-2xl">
          No completed appointments yet. Once a doctor finishes a consultation, it will appear here.
        </div>
      ) : (
        <div className="space-y-4 max-w-2xl">
          {history.map((appt) => (
            <div key={appt._id} className="bg-surface border border-border rounded-xl overflow-hidden">
              <div className="px-6 py-5 border-b border-border flex items-center justify-between">
                <div>
                  <h2 className="font-heading text-lg font-semibold text-textDark">{appt.symptom}</h2>
                  <p className="text-sm text-textMuted">
                    {new Date(appt.consultedAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <SeverityTag level={appt.severity} />
              </div>

              <div className="px-6 py-4 grid grid-cols-2 gap-4 border-b border-border">
                <div>
                  <p className="text-xs text-textMuted mb-1">Pain stage</p>
                  <p className="text-textDark font-medium">{appt.painStage}</p>
                </div>
                <div>
                  <p className="text-xs text-textMuted mb-1">Slot attended</p>
                  <p className="text-textDark font-medium">{appt.slot || "—"}</p>
                </div>
              </div>

              <div className="px-6 py-5">
                <p className="text-xs text-textMuted mb-2">Prescription</p>
                <p className="text-sm text-textDark bg-background rounded-lg px-4 py-3 whitespace-pre-wrap">
                  {appt.prescription || "No prescription notes recorded."}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default PatientHistory;