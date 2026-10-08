import DashboardLayout from "../../components/common/DashboardLayout.jsx";

const AdminDailyCap = () => {
  return (
    <DashboardLayout title="Daily Cap" subtitle="Maximum bookings allowed per day">
      <div className="max-w-xl">
        <div className="bg-surface border border-border rounded-xl p-8 text-center">
          <p className="text-sm text-textMuted mb-2">Current daily cap</p>
          <p className="font-heading text-5xl font-semibold text-primary mb-4">200</p>
          <p className="text-sm text-textMuted">
            Once 200 patients book for a day, the booking form automatically closes — same as reaching the 5:00 PM cutoff.
          </p>
        </div>
        <p className="text-xs text-textMuted mt-4">
          This value is currently set in the codebase (Backend/controllers/patientController.js). A future enhancement could make it editable here.
        </p>
      </div>
    </DashboardLayout>
  );
};

export default AdminDailyCap;