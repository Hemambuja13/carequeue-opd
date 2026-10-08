import { useState, useEffect, useCallback } from "react";
import DashboardLayout from "../../components/common/DashboardLayout.jsx";
import StatCard from "../../components/common/StatCard.jsx";
import SeverityTag from "../../components/common/SeverityTag.jsx";
import { runSorting, getStats, getTodayQueue } from "../../services/adminService.js";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [queue, setQueue] = useState([]);
  const [sorting, setSorting] = useState(false);
  const [message, setMessage] = useState("");

  const loadData = useCallback(async () => {
    try {
      const [statsData, queueData] = await Promise.all([getStats(), getTodayQueue()]);
      setStats(statsData);
      setQueue(queueData);
    } catch (err) {
      // silent fail on poll
    }
  }, []);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 8000);
    return () => clearInterval(interval);
  }, [loadData]);

  const handleRunSorting = async () => {
    setSorting(true);
    setMessage("");
    try {
      const res = await runSorting();
      setMessage(`✓ ${res.message}`);
      loadData();
    } catch (err) {
      setMessage(err.response?.data?.message || "Sorting failed.");
    } finally {
      setSorting(false);
    }
  };

  const bookedPercent = stats ? Math.min((stats.total / stats.cap) * 100, 100) : 0;

  return (
    <DashboardLayout title="Overview" subtitle="Today's OPD activity at a glance">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <StatCard label="Bookings today" value={stats ? `${stats.total} / ${stats.cap}` : "—"} tone="low" />
        <StatCard label="Checked in" value={stats?.checkedIn ?? "—"} />
        <StatCard label="Consultations done" value={stats?.completed ?? "—"} />
        <StatCard label="High severity cases" value={stats?.highSeverity ?? "—"} tone="high" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-surface border border-border rounded-xl p-6">
          <h2 className="font-heading font-semibold text-textDark mb-4">Booking status</h2>
          <div className="w-full bg-background rounded-full h-3 mb-2">
            <div className="bg-primary h-3 rounded-full transition-all" style={{ width: `${bookedPercent}%` }} />
          </div>
          <p className="text-sm text-textMuted">
            {stats ? `${stats.total} of ${stats.cap} daily slots booked` : "Loading..."} · closes at 5:00 PM or when full
          </p>
        </div>

        <div className="bg-surface border border-border rounded-xl p-6">
          <h2 className="font-heading font-semibold text-textDark mb-2">Evening sorting</h2>
          <p className="text-sm text-textMuted mb-4">
            {stats?.pendingSort > 0
              ? `${stats.pendingSort} booking(s) waiting to be sorted into queue numbers and slots.`
              : "All current bookings are sorted."}
          </p>
          <button
            onClick={handleRunSorting}
            disabled={sorting || !stats?.pendingSort}
            className="w-full bg-primary text-white rounded-lg py-3 font-medium hover:bg-primary-dark transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {sorting ? "Sorting..." : "Run Evening Sorting Now"}
          </button>
          {message && <p className="text-sm text-textMuted mt-3">{message}</p>}
        </div>
      </div>

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
                <th className="px-6 py-3 font-medium">Email</th>
                <th className="px-6 py-3 font-medium">Slot</th>
                <th className="px-6 py-3 font-medium">Severity</th>
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
                  <td className="px-6 py-4 text-textMuted">{p.slot || "—"}</td>
                  <td className="px-6 py-4"><SeverityTag level={p.severity} /></td>
                  <td className="px-6 py-4">
                    {p.status === "completed" ? (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-severity-low border border-green-200">
                        Completed
                      </span>
                    ) : p.vitalsEntered ? (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-primary border border-blue-200">
                        Checked in
                      </span>
                    ) : p.status === "sorted" ? (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-severity-medium border border-amber-200">
                        Sorted
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-textMuted border border-gray-200">
                        Booked
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;