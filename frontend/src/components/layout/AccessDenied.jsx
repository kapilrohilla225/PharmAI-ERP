import { Link } from "react-router-dom";
import { ShieldAlert, ArrowRight } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { getAccessibleModules, getDefaultRouteForRole, getRoleLabel } from "../../constants/access";

const AccessDenied = () => {
  const { user } = useAuth();
  const modules = getAccessibleModules(user?.role);
  const homePath = getDefaultRouteForRole(user?.role);

  return (
    <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center px-4">
      <div className="w-full max-w-2xl rounded-3xl border border-slate-800 bg-slate-950/80 p-8 shadow-2xl shadow-black/30 backdrop-blur">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-400">
            <ShieldAlert size={28} />
          </div>
          <div className="flex-1">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Restricted area</p>
            <h1 className="mt-2 text-3xl font-bold text-white">You do not have access to this page</h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-400">
              Your current role is {getRoleLabel(user?.role)}. The backend only permits a narrower surface for this account, so this view stays hidden in the frontend as well.
            </p>
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
          <p className="text-sm font-semibold text-white">Available modules for your role</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {modules.length > 0 ? (
              modules.map((module) => (
                <span
                  key={module.key}
                  className="rounded-full border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs font-medium text-slate-300"
                >
                  {module.label}
                </span>
              ))
            ) : (
              <span className="text-sm text-slate-500">No modules are assigned to this role.</span>
            )}
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            to={homePath}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-500"
          >
            Return to your home screen
            <ArrowRight size={16} />
          </Link>
          <Link
            to="/notifications"
            className="inline-flex items-center justify-center rounded-xl border border-slate-700 bg-slate-900 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:bg-slate-800"
          >
            Open notifications
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AccessDenied;