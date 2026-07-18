import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Pill,
  ShoppingCart,
  ReceiptText,
  BarChart3,
  Bot,
  Bell,
  Settings,
  LogOut,
  X,
  Truck,
  Boxes,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { MODULE_ACCESS, getRoleLabel } from "../../constants/access";

const allMenus = [
  { name: "Dashboard",    icon: LayoutDashboard, ...MODULE_ACCESS.dashboard },
  { name: "Employees",    icon: Users,           ...MODULE_ACCESS.employees },
  { name: "Products",     icon: Pill,            ...MODULE_ACCESS.products },
  { name: "Suppliers",    icon: Truck,           ...MODULE_ACCESS.suppliers },
  { name: "Inventory",    icon: Boxes,           ...MODULE_ACCESS.inventory },
  { name: "Purchases",    icon: ShoppingCart,    ...MODULE_ACCESS.purchases },
  { name: "Sales",        icon: ReceiptText,     ...MODULE_ACCESS.sales },
  { name: "Reports",      icon: BarChart3,       ...MODULE_ACCESS.reports },
  { name: "AI Assistant", icon: Bot,             ...MODULE_ACCESS.ai },
  { name: "Notifications",icon: Bell,            ...MODULE_ACCESS.notifications },
  { name: "Settings",     icon: Settings,        ...MODULE_ACCESS.settings },
];

const Sidebar = ({ mobileOpen = false, onClose, isCollapsed = false }) => {
  const { user, logout } = useAuth();

  // Only show menus the current role has access to — no locked items shown
  const menus = allMenus.filter((menu) => menu.roles.includes(user?.role));

  return (
    <>
      {mobileOpen && (
        <button
          type="button"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-950/70 lg:hidden"
          aria-label="Close navigation menu"
        />
      )}

      <aside className={`fixed inset-y-0 left-0 z-50 flex-col border-r border-slate-800/80 bg-slate-950 transition-[width,transform] duration-300 lg:sticky lg:top-0 lg:flex lg:h-screen lg:translate-x-0 ${isCollapsed ? "w-20" : "w-72"} ${mobileOpen ? "translate-x-0 flex w-72" : "-translate-x-full hidden lg:flex"}`}>
        
        {/* Brand Header */}
        <div className={`mb-8 flex items-start gap-4 p-5 ${isCollapsed ? "justify-center px-0" : "justify-between"}`}>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-sm font-bold text-white shadow-lg shadow-blue-600/30">
              G
            </div>
            {!isCollapsed && (
              <div className="overflow-hidden transition-opacity duration-300">
                <h1 className="text-lg font-bold text-white whitespace-nowrap">Gloss Pharma</h1>
                <p className="text-xs text-slate-500 whitespace-nowrap">ERP v1.0</p>
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-800 bg-slate-900 p-2 text-slate-400 lg:hidden shrink-0"
            aria-label="Close navigation"
          >
            <X size={16} />
          </button>
        </div>

        {/* User Card */}
        {user && !isCollapsed && (
          <div className="mx-5 mb-6 rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Signed in as</p>
            <p className="mt-2 text-sm font-semibold text-white truncate">{user.fullName}</p>
            <p className="text-xs text-slate-400">{getRoleLabel(user.role)}</p>
          </div>
        )}

        {/* Navigation — only accessible items shown, no locked badges */}
        <nav className={`flex-1 space-y-2 overflow-y-auto ${isCollapsed ? "px-3" : "px-5"}`}>
          {menus.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                title={isCollapsed ? item.name : undefined}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl py-3 text-sm transition-all duration-200 ${isCollapsed ? "justify-center px-0" : "px-3"} ${
                    isActive
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20 font-semibold"
                      : "text-slate-400 hover:bg-slate-800/80 hover:text-white"
                  }`
                }
              >
                <Icon size={isCollapsed ? 22 : 18} className="shrink-0" />
                {!isCollapsed && (
                  <span className="whitespace-nowrap">{item.name}</span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="border-t border-slate-800 p-5">
          <button
            type="button"
            onClick={logout}
            title={isCollapsed ? "Sign Out" : undefined}
            className={`flex w-full items-center gap-3 rounded-xl py-3 text-sm text-red-400 transition hover:bg-red-500/10 cursor-pointer ${isCollapsed ? "justify-center px-0" : "px-3"}`}
          >
            <LogOut size={isCollapsed ? 22 : 18} className="shrink-0" />
            {!isCollapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;