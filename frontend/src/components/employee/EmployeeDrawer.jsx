import React from "react";
import { X } from "lucide-react";

const EmployeeDrawer = ({ open, onClose, title = "Add Employee", children }) => {
  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          open ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      />

      {/* Drawer Panel */}
      <div
        className={`fixed right-0 top-0 z-50 h-screen w-full bg-slate-950 shadow-2xl transition-transform duration-300 ease-in-out md:w-[540px] border-l border-slate-800 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-5">
          <div>
            <h2 className="text-xl font-bold text-white">{title}</h2>
          </div>
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto h-[calc(100vh-73px)] p-6">
          {children}
        </div>
      </div>
    </>
  );
};

export default EmployeeDrawer;