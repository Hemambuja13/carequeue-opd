const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-primary-dark via-primary to-primary-light flex items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-5xl bg-surface rounded-2xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-2">
        {/* Left info panel */}
        <div className="hidden lg:flex flex-col justify-between p-12 bg-primary-dark text-white">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 2v20M2 12h20" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </div>
            <span className="font-heading text-xl font-semibold tracking-tight">
              CareQueue
            </span>
          </div>

          <div>
            <h2 className="font-heading text-3xl font-semibold leading-snug">
              Care, ordered by who needs it most.
            </h2>
            <p className="mt-4 text-white/70 leading-relaxed">
              Appointments are sorted by severity, waiting time, and age — not
              by who showed up first.
            </p>

            <div className="mt-10 space-y-5">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center font-heading font-semibold">
                  1
                </div>
                <div>
                  <p className="font-medium">Book a day ahead</p>
                  <p className="text-sm text-white/60">Enter symptoms and pain level</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center font-heading font-semibold">
                  2
                </div>
                <div>
                  <p className="font-medium">Get your evening slot</p>
                  <p className="text-sm text-white/60">SMS confirmation by 6 PM</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center font-heading font-semibold">
                  3
                </div>
                <div>
                  <p className="font-medium">Live queue tracking</p>
                  <p className="text-sm text-white/60">Vitals-based re-sort on arrival</p>
                </div>
              </div>
            </div>
          </div>

          <p className="text-xs text-white/50">© 2026 CareQueue OPD System</p>
        </div>

        {/* Right form panel */}
        <div className="p-8 sm:p-12 lg:p-14 flex flex-col justify-center">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;