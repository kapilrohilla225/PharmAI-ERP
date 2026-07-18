import { useAuth } from "../../context/AuthContext";

const roles = [
  { role: "admin", label: "Admin" },
  { role: "hr", label: "HR" },
  { role: "employee", label: "Employee" },
];

const DemoBanner = () => {
  const { user, demoMode } = useAuth();
  if (!demoMode || !user) return null;

  return (
    <div className="bg-gradient-to-r from-amber-600/15 via-amber-500/8 to-amber-600/15 border-b border-amber-500/15 px-4 py-1.5">
      <div className="mx-auto w-full max-w-[1600px] flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2 text-xs text-amber-300/90">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
          <span>
            Demo Mode — exploring as{' '}
            <strong className="text-white capitalize">{user.role}</strong>
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-amber-400/60">Switch:</span>
          {roles.map(({ role, label }) => (
            <button
              key={role}
              onClick={() => { window.location.href = `/?demo=${role}`; }}
              className={`text-xs px-2.5 py-0.5 rounded-md border transition cursor-pointer ${
                user.role === role
                  ? "bg-amber-500/20 border-amber-500/30 text-amber-300 font-semibold"
                  : "bg-slate-800/50 border-slate-700/50 text-slate-400 hover:text-white hover:border-amber-500/30"
              }`}
            >
              {label}
            </button>
          ))}
          <span className="mx-1 w-px h-4 bg-slate-700/60" />
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              window.location.href = "/";
            }}
            className="text-xs text-slate-500 hover:text-slate-300 transition"
          >
            Exit Demo
          </a>
        </div>
      </div>
    </div>
  );
};

export default DemoBanner;
