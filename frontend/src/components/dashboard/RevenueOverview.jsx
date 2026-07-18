import React from "react";
import { DollarSign, TrendingDown, TrendingUp } from "lucide-react";

const RevenueOverview = ({ sales = [], purchases = [] }) => {
  const totalSales = sales.reduce((sum, s) => sum + (s.totalAmount || 0), 0);
  const totalPurchases = purchases.reduce((sum, p) => sum + (p.totalAmount || 0), 0);
  const grossProfit = totalSales - totalPurchases;
  const isProfitable = grossProfit >= 0;

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 flex flex-col">
      <h3 className="mb-5 text-lg font-bold text-white flex items-center gap-2">
        <DollarSign size={18} className="text-emerald-400" />
        Financial Overview
      </h3>

      <div className="space-y-4 flex-1">
        <div className="rounded-xl bg-slate-800/40 border border-slate-700/60 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wider">Revenue</p>
              <p className="mt-1 text-xl font-bold text-white">₹{totalSales.toLocaleString("en-IN")}</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
              <TrendingUp size={20} className="text-emerald-400" />
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-slate-800/40 border border-slate-700/60 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wider">Procurement Costs</p>
              <p className="mt-1 text-xl font-bold text-white">₹{totalPurchases.toLocaleString("en-IN")}</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/10">
              <TrendingDown size={20} className="text-orange-400" />
            </div>
          </div>
        </div>

        <div className={`rounded-xl border p-4 ${isProfitable ? "bg-emerald-500/5 border-emerald-500/20" : "bg-rose-500/5 border-rose-500/20"}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wider text-slate-400">Net Profit</p>
              <p className={`mt-1 text-xl font-extrabold ${isProfitable ? "text-emerald-400" : "text-rose-400"}`}>
                {isProfitable ? "+" : ""}₹{grossProfit.toLocaleString("en-IN")}
              </p>
            </div>
            <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${isProfitable ? "bg-emerald-500/10" : "bg-rose-500/10"}`}>
              <DollarSign size={20} className={isProfitable ? "text-emerald-400" : "text-rose-400"} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevenueOverview;