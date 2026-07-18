import React from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const SalesAreaChart = ({ sales = [] }) => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const monthlyData = months.map((m) => ({ month: m, sales: 0 }));

  sales.forEach((s) => {
    if (s.createdAt) {
      const date = new Date(s.createdAt);
      const monthIdx = date.getMonth();
      monthlyData[monthIdx].sales += s.totalAmount || 0;
    }
  });

  const currentMonthIdx = new Date().getMonth();
  // Filter list up to current month to avoid listing future empty months
  const chartData = monthlyData.slice(0, currentMonthIdx + 1);

  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="sales" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2563eb" stopOpacity={0.5} />
              <stop offset="100%" stopColor="#2563eb" stopOpacity={0.02} />
            </linearGradient>
          </defs>

          <CartesianGrid stroke="#1e293b" />
          <XAxis dataKey="month" stroke="#64748b" />
          <YAxis stroke="#64748b" />
          <Tooltip
            contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "12px", color: "#fff" }}
          />

          <Area
            type="monotone"
            dataKey="sales"
            stroke="#3b82f6"
            strokeWidth={3}
            fill="url(#sales)"
            name="Sales Revenue (₹)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SalesAreaChart;