import { Link, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const navByRole = {
  patient: [
    { label: "Book Appointment", path: "/patient/dashboard", icon: "📝" },
    { label: "History & Prescriptions", path: "/patient/history", icon: "📋" },
  ],
  nurse: [],
  doctor: [{ label: "Search Patient", path: "/doctor/dashboard", icon: "🔍" }],
  admin: [
    { label: "Overview", path: "/admin/dashboard", icon: "📊" },
    { label: "Symptoms", path: "/admin/symptoms", icon: "🏷️" },
    { label: "Daily Cap", path: "/admin/settings", icon: "⚙️" },
    { label: "Staff", path: "/admin/staff", icon: "👥" },
  ],
};

const roleLabel = { patient: "Patient", nurse: "Nurse", doctor: "Doctor", admin: "Admin" };

const DashboardLayout = ({ children, title, subtitle, actions, customNav }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navItems = navByRole[user?.role] || [];

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <div className="min-h-screen flex bg-background">
      <aside className="w-64 bg-primary-dark text-white flex flex-col shrink-0">
        <div className="flex items-center gap-3 px-6 py-6 border-b border-white/10">
          <div className="w-9 h-9 rounded-lg bg-white/15 flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M12 2v20M2 12h20" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
          <span className="font-heading font-semibold text-lg">CareQueue</span>
        </div>

        <nav className="flex-1 px-3 py-6 space-y-1">
          {customNav
            ? customNav.map((item) => (
                <button
                  key={item.key}
                  onClick={item.onClick}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition text-left ${
                    item.active ? "bg-white/15 text-white" : "text-white/70 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <span>{item.icon}</span>
                  {item.label}
                  {item.badge > 0 && (
                    <span className="ml-auto bg-severity-medium text-white text-xs rounded-full px-2 py-0.5">
                      {item.badge}
                    </span>
                  )}
                </button>
              ))
            : navItems.map((item) => {
                const active = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition ${
                      active ? "bg-white/15 text-white" : "text-white/70 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <span>{item.icon}</span>
                    {item.label}
                  </Link>
                );
              })}
        </nav>

        <div className="px-6 py-5 border-t border-white/10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center font-heading font-semibold text-sm">
              {user?.name?.charAt(0) || "U"}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">{user?.name}</p>
              <p className="text-xs text-white/50">{roleLabel[user?.role]}</p>
            </div>
          </div>
          <button onClick={logout} className="text-sm text-white/70 hover:text-white transition">
            Sign out
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-20 bg-surface border-b border-border flex items-center justify-between px-8 shrink-0">
          <div>
            <h1 className="font-heading text-xl font-semibold text-textDark">{title}</h1>
            {subtitle && <p className="text-sm text-textMuted mt-0.5">{subtitle}</p>}
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-textMuted hidden sm:block">{today}</span>
            {actions}
          </div>
        </header>

        <main className="flex-1 p-8 overflow-auto">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;