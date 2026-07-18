import React from "react";
import { ReceiptText } from "lucide-react";

const RecentSales = ({ sales = [] }) => {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 flex flex-col">
      <h3 className="mb-5 text-lg font-bold text-white flex items-center gap-2">
        <ReceiptText size={18} className="text-blue-400" />
        Recent Sales
      </h3>

      <div className="space-y-3 flex-1 max-h-[300px] overflow-y-auto pr-1">
        {sales.length === 0 ? (
          <p className="py-8 text-center text-sm text-slate-500">No sales logged yet</p>
        ) : (
          sales.slice(0, 5).map((sale) => (
            <div
              key={sale._id}
              className="flex items-center justify-between rounded-xl bg-slate-800/40 border border-slate-700/60 p-3.5"
            >
              <div className="min-w-0">
                <h4 className="font-semibold text-white text-sm truncate">{sale.invoiceNumber}</h4>
                <p className="text-xs text-slate-400 mt-0.5 truncate">{sale.customerName}</p>
              </div>
              <span className="font-bold text-emerald-400 text-sm ml-3 shrink-0">
                ₹{sale.totalAmount?.toLocaleString("en-IN")}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RecentSales;