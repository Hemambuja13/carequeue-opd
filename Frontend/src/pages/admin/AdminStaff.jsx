import { useState, useEffect } from "react";
import DashboardLayout from "../../components/common/DashboardLayout.jsx";
import { getStaff } from "../../services/adminService.js";

const roleBadge = {
  nurse: "bg-blue-50 text-primary border-blue-200",
  doctor: "bg-purple-50 text-primary border-purple-200",
  admin: "bg-amber-50 text-severity-medium border-amber-200",
};

const AdminStaff = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getStaff();
        setStaff(data);
      } catch (err) {
        setStaff([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <DashboardLayout title="Staff" subtitle="Nurse, doctor, and admin accounts">
      {loading ? (
        <div className="text-textMuted">Loading...</div>
      ) : (
        <div className="max-w-3xl bg-surface border border-border rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-border flex items-center justify-between">
            <h2 className="font-heading font-semibold text-textDark">All staff accounts</h2>
            <span className="text-sm text-textMuted">{staff.length} total</span>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-textMuted border-b border-border">
                <th className="px-6 py-3 font-medium">Name</th>
                <th className="px-6 py-3 font-medium">Email</th>
                <th className="px-6 py-3 font-medium">Role</th>
              </tr>
            </thead>
            <tbody>
              {staff.map((s) => (
                <tr key={s._id} className="border-b border-border last:border-0">
                  <td className="px-6 py-4 text-textDark font-medium">{s.name}</td>
                  <td className="px-6 py-4 text-textMuted">{s.email}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${roleBadge[s.role]}`}>
                      {s.role}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="px-6 py-4 border-t border-border">
            <p className="text-xs text-textMuted">
              New staff accounts are currently created via the backend seed script, not self-registered — this keeps hospital-side access controlled.
            </p>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default AdminStaff;