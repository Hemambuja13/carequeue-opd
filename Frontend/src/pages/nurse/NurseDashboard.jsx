import { useState, useEffect, useCallback } from "react";
import DashboardLayout from "../../components/common/DashboardLayout.jsx";
import SeverityTag from "../../components/common/SeverityTag.jsx";
import { searchPatientByMobile, saveVitals, getTodayQueue } from "../../services/nurseService.js";

const POLL_INTERVAL = 8000;

const NurseDashboard = () => {
  const [activeTab, setActiveTab] = useState("search");
  const [queue, setQueue] = useState([]);

  const loadQueue = useCallback(async () => {
    try {
      const data = await getTodayQueue();
      setQueue(data);
    } catch (err) {
      // silent fail on poll
    }
  }, []);

  useEffect(() => {
    loadQueue();
    const interval = setInterval(loadQueue, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [loadQueue]);

  const vitalsPendingCount = queue.filter((p) => !p.vitalsEntered).length;

  const customNav = [
    { key: "search", label: "Search & Enter Vitals", icon: "🔍", active: activeTab === "search", onClick: () => setActiveTab("search"), badge: vitalsPendingCount },
    { key: "queue", label: "Patient Queue", icon: "🩺", active: activeTab === "queue", onClick: () => setActiveTab("queue") },
    { key: "all", label: "All Patients Today", icon: "📋", active: activeTab === "all", onClick: () => setActiveTab("all") },
  ];

  const titles = {
    search: "Search & Enter Vitals",
    queue: "Patient Queue",
    all: "All Patients Today",
  };

  return (
    <DashboardLayout title={titles[activeTab]} subtitle="Track today's OPD patients" customNav={customNav}>
      {activeTab === "search" && <SearchAndEnterVitals onVitalsSaved={loadQueue} />}
      {activeTab === "queue" && <PatientQueueView queue={queue} />}
      {activeTab === "all" && <AllPatientsView queue={queue} />}
    </DashboardLayout>
  );
};

const SearchAndEnterVitals = ({ onVitalsSaved }) => {
  const [email, setEmail] = useState("");
  const [found, setFound] = useState(null);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ bp: "", temp: "", nurseNotes: "" });
  const [saved, setSaved] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setSaved(false);
    setError("");
    try {
      const data = await searchPatientByMobile(email.trim());
      setFound(data);
      setForm({ bp: data.bp || "", temp: data.temp || "", nurseNotes: data.nurseNotes || "" });
    } catch (err) {
      setFound(null);
      setError(err.response?.data?.message || "Patient not found.");
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const updated = await saveVitals(found._id, form);
      setFound(updated);
      setSaved(true);
      onVitalsSaved();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save vitals.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSearch} className="flex gap-3 mb-6">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter registered email address"
          className="flex-1 border border-border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
        />
        <button type="submit" className="bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-dark transition">
          Search
        </button>
      </form>

      {error && (
        <div className="bg-red-50 border border-red-200 text-severity-high rounded-lg px-4 py-3 text-sm mb-6">
          {error}
        </div>
      )}

      {found && (
        <div className="bg-surface border border-border rounded-xl overflow-hidden">
          <div className="px-6 py-5 border-b border-border flex items-center justify-between">
            <div>
              <h2 className="font-heading text-lg font-semibold text-textDark">{found.name}</h2>
              <p className="text-sm text-textMuted">Age {found.age} · {found.email}</p>
            </div>
            <SeverityTag level={found.severity} />
          </div>

          <div className="px-6 py-5 grid grid-cols-2 gap-4 border-b border-border">
            <div>
              <p className="text-xs text-textMuted mb-1">Reported symptom</p>
              <p className="text-textDark font-medium">{found.symptom}</p>
            </div>
            <div>
              <p className="text-xs text-textMuted mb-1">Pain stage (self-reported)</p>
              <p className="text-textDark font-medium">{found.painStage}</p>
            </div>
          </div>

          <form onSubmit={handleSave} className="px-6 py-5 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-textDark mb-2">Blood Pressure</label>
                <input
                  required
                  value={form.bp}
                  onChange={(e) => setForm({ ...form, bp: e.target.value })}
                  placeholder="e.g. 120/80"
                  className="w-full border border-border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-textDark mb-2">Temperature</label>
                <input
                  required
                  value={form.temp}
                  onChange={(e) => setForm({ ...form, temp: e.target.value })}
                  placeholder="e.g. 98.6°F"
                  className="w-full border border-border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-textDark mb-2">Additional notes (optional)</label>
              <textarea
                rows={3}
                value={form.nurseNotes}
                onChange={(e) => setForm({ ...form, nurseNotes: e.target.value })}
                placeholder="Any other observations..."
                className="w-full border border-border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
              />
            </div>

            <button type="submit" disabled={submitting} className="w-full bg-primary text-white rounded-lg py-3 font-medium hover:bg-primary-dark transition disabled:opacity-60">
              {submitting ? "Saving..." : found.vitalsEntered ? "Update Vitals" : "Save Vitals & Send to Doctor"}
            </button>
          </form>

          {saved && (
            <div className="px-6 pb-6">
              <div className="bg-green-50 border border-green-200 text-severity-low rounded-lg px-4 py-3 text-sm">
                ✓ Vitals saved. Check "Patient Queue" — it updates automatically.
              </div>
            </div>
          )}
        </div>
      )}

      {!found && !error && (
        <div className="bg-surface border border-border rounded-xl p-10 text-center text-textMuted">
          Search a patient's email address to begin.
        </div>
      )}
    </div>
  );
};

const PatientQueueView = ({ queue }) => (
  <div className="bg-surface border border-border rounded-xl overflow-hidden">
    <div className="px-6 py-4 border-b border-border flex items-center justify-between">
      <h2 className="font-heading font-semibold text-textDark">Today's queue</h2>
      <span className="text-xs text-textMuted">Auto-refreshes every few seconds</span>
    </div>
    {queue.length === 0 ? (
      <div className="p-10 text-center text-textMuted">No patients booked for today yet.</div>
    ) : (
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-textMuted border-b border-border">
            <th className="px-6 py-3 font-medium">Queue #</th>
            <th className="px-6 py-3 font-medium">Patient</th>
            <th className="px-6 py-3 font-medium">Slot</th>
            <th className="px-6 py-3 font-medium">Severity</th>
            <th className="px-6 py-3 font-medium">Vitals Status</th>
          </tr>
        </thead>
        <tbody>
          {queue.map((p) => (
            <tr key={p._id} className="border-b border-border last:border-0 hover:bg-background/50">
              <td className="px-6 py-4 font-heading font-semibold text-textDark">
                {p.queueNo ? `#${p.queueNo}` : "—"}
              </td>
              <td className="px-6 py-4 text-textDark">{p.name}</td>
              <td className="px-6 py-4 text-textMuted">{p.slot || "—"}</td>
              <td className="px-6 py-4"><SeverityTag level={p.severity} /></td>
              <td className="px-6 py-4">
                {p.vitalsEntered ? (
                  <span className="text-severity-low text-sm font-medium">✓ Checked</span>
                ) : (
                  <span className="text-severity-medium text-sm font-medium">Pending</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    )}
  </div>
);

const AllPatientsView = ({ queue }) => (
  <div className="bg-surface border border-border rounded-xl overflow-hidden">
    <div className="px-6 py-4 border-b border-border flex items-center justify-between">
      <h2 className="font-heading font-semibold text-textDark">All patients — today</h2>
      <span className="text-sm text-textMuted">{queue.length} total</span>
    </div>
    {queue.length === 0 ? (
      <div className="p-10 text-center text-textMuted">No patients booked for today yet.</div>
    ) : (
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-textMuted border-b border-border">
            <th className="px-6 py-3 font-medium">Queue #</th>
            <th className="px-6 py-3 font-medium">Patient</th>
            <th className="px-6 py-3 font-medium">Email</th>
            <th className="px-6 py-3 font-medium">Age</th>
            <th className="px-6 py-3 font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          {queue.map((p) => (
            <tr key={p._id} className="border-b border-border last:border-0 hover:bg-background/50">
              <td className="px-6 py-4 font-heading font-semibold text-textDark">
                {p.queueNo ? `#${p.queueNo}` : "—"}
              </td>
              <td className="px-6 py-4 text-textDark">{p.name}</td>
              <td className="px-6 py-4 text-textMuted">{p.email}</td>
              <td className="px-6 py-4 text-textMuted">{p.age}</td>
              <td className="px-6 py-4">
                {p.status === "completed" ? (
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-severity-low border border-green-200">
                    Completed
                  </span>
                ) : p.vitalsEntered ? (
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-primary border border-blue-200">
                    Checked in
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-severity-medium border border-amber-200">
                    Pending
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    )}
  </div>
);

export default NurseDashboard;