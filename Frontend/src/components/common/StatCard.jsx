const StatCard = ({ label, value, sub, tone = "default" }) => {
  const toneStyles = {
    default: "text-primary",
    high: "text-severity-high",
    medium: "text-severity-medium",
    low: "text-severity-low",
  };

  return (
    <div className="bg-surface border border-border rounded-xl p-6">
      <p className="text-sm text-textMuted mb-2">{label}</p>
      <p className={`font-heading text-3xl font-semibold ${toneStyles[tone]}`}>{value}</p>
      {sub && <p className="text-xs text-textMuted mt-1">{sub}</p>}
    </div>
  );
};

export default StatCard;