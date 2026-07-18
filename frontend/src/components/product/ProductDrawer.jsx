import React from "react";

const ProductDrawer = ({ open, onClose, children, title }) => {
  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 ${
          open ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      />

      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 z-50 h-screen w-full bg-slate-950 shadow-2xl transition-transform duration-300 md:w-[540px] ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-slate-800 p-6">
          <h2 className="text-2xl font-bold text-white">
            {title || "Product Form"}
          </h2>
          <button
            onClick={onClose}
            className="text-3xl text-slate-400 hover:text-white"
          >
            ×
          </button>
        </div>

        <div className="overflow-y-auto p-6 h-[calc(100vh-80px)]">
          {children}
        </div>
      </div>
    </>
  );
};

export default ProductDrawer;
