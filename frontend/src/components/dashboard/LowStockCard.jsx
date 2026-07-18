import React from "react";
import { AlertTriangle, Package } from "lucide-react";
import Badge from "../ui/Badge";

const LowStockCard = ({ products = [] }) => {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 flex flex-col">
      <h3 className="mb-5 text-lg font-bold text-white flex items-center gap-2">
        <AlertTriangle size={18} className="text-amber-400" />
        Low Stock Medicines
      </h3>

      <div className="space-y-3 flex-1 max-h-[300px] overflow-y-auto">
        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Package size={32} className="text-slate-600 mb-2" />
            <p className="text-sm text-slate-500">All inventory levels are safe</p>
          </div>
        ) : (
          products.map((item) => (
            <div
              key={item._id}
              className="flex items-center justify-between rounded-xl bg-slate-800/40 border border-slate-700/60 p-3.5"
            >
              <div className="flex flex-col">
                <span className="text-white text-sm font-semibold">{item.productName}</span>
                <span className="text-xs text-slate-400 mt-0.5">
                  Stock: <span className="font-semibold text-amber-300">{item.quantity}</span> units
                </span>
              </div>
              <Badge variant="warning">Low Stock</Badge>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default LowStockCard;