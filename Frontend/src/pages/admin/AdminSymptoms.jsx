import DashboardLayout from "../../components/common/DashboardLayout.jsx";
import { SYMPTOM_LIST } from "../../utils/constants.js";

const AdminSymptoms = () => {
  return (
    <DashboardLayout title="Symptoms" subtitle="Symptoms available in the patient booking form">
      <div className="max-w-3xl">
        <div className="bg-surface border border-border rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-border flex items-center justify-between">
            <h2 className="font-heading font-semibold text-textDark">Current symptom list</h2>
            <span className="text-sm text-textMuted">{SYMPTOM_LIST.length} symptoms</span>
          </div>
          <div className="p-6 grid grid-cols-2 sm:grid-cols-3 gap-3">
            {SYMPTOM_LIST.map((s) => (
              <div key={s} className="bg-background rounded-lg px-4 py-2.5 text-sm text-textDark">
                {s}
              </div>
            ))}
          </div>
        </div>
        <p className="text-xs text-textMuted mt-4">
          This list is currently managed in the codebase (src/utils/constants.js). A future enhancement could make it editable here.
        </p>
      </div>
    </DashboardLayout>
  );
};

export default AdminSymptoms;