import React from "react";
import { Info } from "lucide-react";

const Empty = ({ message = "No data available", className }) => {
  return (
    <div className={`flex flex-col items-center justify-center py-12 px-4 text-center ${className}`}>
      <Info size={40} className="text-slate-600 mb-3" />
      <p className="text-slate-400 font-medium">{message}</p>
    </div>
  );
};

export default Empty;
