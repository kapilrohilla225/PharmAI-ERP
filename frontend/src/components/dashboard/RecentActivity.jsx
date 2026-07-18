import React from "react";
import { Clock, UserCircle } from "lucide-react";

const moduleColors = {
  product: "bg-emerald-500/10 text-emerald-400",
  sale: "bg-blue-500/10 text-blue-400",
  purchase: "bg-orange-500/10 text-orange-400",
  employee: "bg-purple-500/10 text-purple-400",
  user: "bg-rose-500/10 text-rose-400",
  inventory: "bg-cyan-500/10 text-cyan-400",
};

const RecentActivity = ({ activities = [] }) => {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <h2 className="mb-6 text-lg font-bold text-white">Recent Activity</h2>

      <div className="space-y-0">
        {activities.length === 0 ? (
          <p className="py-8 text-center text-sm text-slate-500">No recent system activity</p>
        ) : (
          activities.slice(0, 6).map((item, idx) => {
            const userInitial = item.user?.fullName?.charAt(0)?.toUpperCase() || "S";
            const modColor = moduleColors[item.module?.toLowerCase()] || "bg-slate-500/10 text-slate-400";
            const isLast = idx === Math.min(activities.length, 6) - 1;

            return (
              <div key={item._id} className="relative flex gap-4 pb-5">
                {!isLast && (
                  <div className="absolute left-[19px] top-10 bottom-0 w-px bg-slate-700/60" />
                )}
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-800 text-sm font-bold text-slate-300 ring-2 ring-slate-700/50">
                  {userInitial}
                </div>
                <div className="flex-1 min-w-0 pt-0.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-medium text-white truncate">{item.description}</span>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${modColor}`}>
                      {item.module}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Clock size={11} />
                      {new Date(item.createdAt).toLocaleDateString("en-IN", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </span>
                    {item.user?.fullName && (
                      <span className="flex items-center gap-1">
                        <UserCircle size={11} />
                        {item.user.fullName}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default RecentActivity;