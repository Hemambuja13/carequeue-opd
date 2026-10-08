const styles = {
  Low: "bg-green-50 text-severity-low border-green-200",
  Medium: "bg-amber-50 text-severity-medium border-amber-200",
  High: "bg-red-50 text-severity-high border-red-200",
};

const SeverityTag = ({ level }) => (
  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${styles[level]}`}>
    {level}
  </span>
);

export default SeverityTag;