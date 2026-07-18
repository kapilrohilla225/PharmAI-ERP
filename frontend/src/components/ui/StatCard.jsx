import React from "react";

const StatCard = ({ title, value, icon: Icon, color = "text-blue-400" }) => {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 hover:border-slate-700 transition duration-200">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{title}</p>
          <h2 className="mt-2 text-3xl font-extrabold text-white tracking-tight">{value}</h2>
        </div>
        <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-slate-800 ${color}`}>
          {Icon && <Icon size={24} />}
        </div>
      </div>
    </div>
  );
};

export default StatCard;