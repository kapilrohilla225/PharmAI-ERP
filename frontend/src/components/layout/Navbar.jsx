import React, { useState, useRef, useEffect } from "react";
import {
  Bell,
  Menu,
  Search,
  Sun,
  Moon,
  UserCircle2,
  ChevronDown,
  LogOut,
  User,
  AlertTriangle,
  AlertCircle,
  CalendarRange,
  X,
  CheckCheck,
  Trash2,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { getRoleLabel } from "../../constants/access";
import useDismissibleNotifications from "../../hooks/useDismissibleNotifications";

const Navbar = ({ onMenuClick, onCollapseToggle, isCollapsed }) => {
  const { user, roleLabel, logout, demoMode } = useAuth();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();

  /* ─── Dropdowns ─────────────────────────────────────────────────── */
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const profileRef = useRef(null);
  const notifRef = useRef(null);

  /* ─── Theme ──────────────────────────────────────────────────────── */
  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  /* ─── Notifications state ────────────────────────────────────────── */
  const {
    loading: notifLoading, fetch: loadNotifications,
    lowStock, expiringSoon, expired,
    totalCount, dismiss, dismissAll, fetch,
  } = useDismissibleNotifications();

  const openNotif = () => {
    setNotifOpen(true);
    setProfileOpen(false);
    loadNotifications();
  };

  /* ─── Close dropdowns on outside click ──────────────────────────── */
  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* ─── Notification pill colours ─────────────────────────────────── */
  const variantCls = {
    danger: "bg-rose-500/10 border-rose-500/20 text-rose-400",
    warning: "bg-amber-500/10 border-amber-500/20 text-amber-400",
    info: "bg-blue-500/10 border-blue-500/20 text-blue-400",
  };

  const notifItems = [
    ...expired.slice(0, 3).map((p) => ({
      id: `expired_${p._id}`,
      icon: AlertCircle,
      label: p.productName,
      sub: `Batch ${p.batchNo} — Expired`,
      variant: "danger",
    })),
    ...lowStock.slice(0, 3).map((p) => ({
      id: `low_${p._id}`,
      icon: AlertTriangle,
      label: p.productName,
      sub: `Stock: ${p.quantity} / Min: ${p.minimumStock}`,
      variant: "warning",
    })),
    ...expiringSoon.slice(0, 3).map((p) => ({
      id: `exp_soon_${p._id}`,
      icon: CalendarRange,
      label: p.productName,
      sub: `Expiring: ${new Date(p.expiryDate).toLocaleDateString("en-IN")}`,
      variant: "info",
    })),
  ];

  return (
    <header className="z-30 flex shrink-0 h-16 items-center justify-between border-b border-slate-800/80 bg-slate-950/90 px-4 backdrop-blur md:h-20 md:px-8">

      {/* ── Left ──────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3">
        <button
          className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          onClick={onMenuClick}
          aria-label="Toggle navigation menu"
        >
          <Menu size={22} />
        </button>

        <button
          className="hidden lg:flex items-center justify-center rounded-xl bg-slate-900 border border-slate-800 p-2.5 text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          onClick={onCollapseToggle}
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          <Menu size={18} />
        </button>

        <div className="relative hidden md:block">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
          <input
            type="text"
            placeholder="Search anything..."
            className="w-56 xl:w-80 rounded-xl border border-slate-800 bg-slate-900/80 py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 outline-none focus:border-blue-600/50 focus:bg-slate-900 transition"
          />
        </div>
      </div>

      {/* ── Right ─────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-2">

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
          className="hidden sm:flex items-center justify-center rounded-xl bg-slate-900 border border-slate-800 p-2.5 text-slate-400 hover:text-yellow-400 hover:bg-slate-800 hover:border-yellow-400/30 transition cursor-pointer"
        >
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Notification Bell */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={openNotif}
            title="Notifications"
            className="relative flex items-center justify-center rounded-xl bg-slate-900 border border-slate-800 p-2.5 text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <Bell size={18} />
            {totalCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white ring-2 ring-slate-950 animate-pulse">
                {totalCount > 9 ? "9+" : totalCount}
              </span>
            )}
          </button>

          {/* Notification Dropdown */}
          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 origin-top-right rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl z-50 overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Bell size={15} className="text-blue-400" />
                  <span className="text-sm font-bold text-white">Notifications</span>
                  {totalCount > 0 && (
                    <span className="rounded-full bg-rose-500/20 border border-rose-500/30 text-rose-400 text-[10px] font-bold px-2 py-0.5">
                      {totalCount}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  {totalCount > 0 && (
                    <button
                      onClick={() => { dismissAll(); }}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-800 transition cursor-pointer"
                      title="Clear all"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                  <button onClick={() => setNotifOpen(false)} className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-slate-800 transition cursor-pointer">
                    <X size={16} />
                  </button>
                </div>
              </div>

              {/* Body */}
              <div className="max-h-80 overflow-y-auto">
                {notifLoading ? (
                  <div className="flex flex-col items-center justify-center py-10 gap-3">
                    <div className="h-6 w-6 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
                    <p className="text-xs text-slate-500">Loading alerts…</p>
                  </div>
                ) : notifItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 gap-2 text-center px-4">
                    <CheckCheck size={28} className="text-emerald-500" />
                    <p className="text-sm font-semibold text-white">All clear!</p>
                    <p className="text-xs text-slate-500">No active stock or expiry alerts.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-800/60">
                    {notifItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <div
                          key={item.id}
                          className="flex items-start gap-3 px-4 py-3 hover:bg-slate-800/40 transition group"
                        >
                          <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border ${variantCls[item.variant]}`}>
                            <Icon size={14} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-white truncate">{item.label}</p>
                            <p className="text-[11px] text-slate-400 mt-0.5">{item.sub}</p>
                          </div>
                          <button
                            onClick={() => dismiss(item.id)}
                            className="opacity-0 group-hover:opacity-100 p-1 rounded-lg text-slate-500 hover:text-white hover:bg-slate-700 transition cursor-pointer shrink-0"
                            title="Dismiss"
                          >
                            <X size={13} />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="border-t border-slate-800 px-4 py-3 flex gap-2">
                <button
                  onClick={() => { setNotifOpen(false); navigate("/notifications"); }}
                  className="flex-1 text-center text-xs font-semibold text-blue-400 hover:text-blue-300 transition cursor-pointer"
                >
                  View All Notifications →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }}
            className="flex items-center gap-2 rounded-2xl hover:bg-slate-800 px-2 py-1.5 transition cursor-pointer"
          >
            {user?.avatar ? (
              <img src={user.avatar} alt="Avatar" className="h-8 w-8 rounded-full object-cover border border-slate-700" />
            ) : (
              <UserCircle2 size={34} className="text-slate-300" />
            )}

            <div className="hidden lg:block text-left">
              <h6 className="text-sm font-semibold text-white leading-tight">{user?.fullName || "User"}</h6>
              <p className="text-[11px] text-slate-400 capitalize leading-tight">{roleLabel || getRoleLabel(user?.role)}</p>
            </div>

            <ChevronDown size={14} className={`text-slate-500 transition-transform duration-200 ${profileOpen ? "rotate-180" : ""}`} />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-52 origin-top-right rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl py-2 z-50">
              <div className="px-4 py-3 border-b border-slate-800/80 mb-1">
                <p className="text-sm font-semibold text-white truncate">{user?.fullName}</p>
                <p className="text-xs text-slate-400 truncate">{user?.email}</p>
              </div>

              <Link
                to="/profile"
                onClick={() => setProfileOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition"
              >
                <User size={15} />
                <span>My Profile</span>
              </Link>

              <div className="border-t border-slate-800 mt-1 pt-1">
                <button
                  onClick={() => {
                    setProfileOpen(false);
                    if (demoMode) {
                      window.location.href = "/";
                    } else {
                      logout();
                    }
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-rose-400 hover:bg-rose-500/10 transition cursor-pointer"
                >
                  <LogOut size={15} />
                  <span>{demoMode ? "Exit Demo" : "Sign Out"}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

    </header>
  );
};

export default Navbar;