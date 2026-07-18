import React, { useState } from "react";
import { Bell, AlertTriangle, AlertCircle, CalendarRange, History, Clock, X, Trash2, CheckCheck } from "lucide-react";
import PageHeader from "../../components/ui/PageHeader";
import Loader from "../../components/ui/Loader";
import Badge from "../../components/ui/Badge";
import useDismissibleNotifications from "../../hooks/useDismissibleNotifications";

const Notifications = () => {
  const [activeTab, setActiveTab] = useState("alerts");
  const {
    loading, fetch,
    lowStock, expiringSoon, expired, auditLogs,
    totalCount, dismiss, dismissAll,
  } = useDismissibleNotifications();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Notifications & Activity Center"
        subtitle="Stay updated on inventory shortages, batch expiration timelines, and administrative logs"
      >
        <button
          onClick={() => { dismissAll(); fetch(); }}
          className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-300 transition hover:bg-slate-700 hover:text-white cursor-pointer"
        >
          <Trash2 size={14} />
          Clear All
        </button>
      </PageHeader>

      <div className="flex gap-4 border-b border-slate-800 pb-px shrink-0">
        <button
          onClick={() => setActiveTab("alerts")}
          className={`pb-4 text-sm font-semibold tracking-tight transition border-b-2 px-1 flex items-center gap-2 cursor-pointer ${
            activeTab === "alerts"
              ? "border-blue-500 text-white font-bold"
              : "border-transparent text-slate-400 hover:text-white"
          }`}
        >
          <Bell size={16} />
          <span>Active Alerts</span>
          {totalCount > 0 && (
            <span className="rounded-full bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 animate-pulse">
              {totalCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab("audit")}
          className={`pb-4 text-sm font-semibold tracking-tight transition border-b-2 px-1 flex items-center gap-2 cursor-pointer ${
            activeTab === "audit"
              ? "border-blue-500 text-white font-bold"
              : "border-transparent text-slate-400 hover:text-white"
          }`}
        >
          <History size={16} />
          <span>System Audit Logs</span>
          {auditLogs.length > 0 && (
            <span className="rounded-full bg-slate-700 text-slate-300 text-[10px] font-bold px-2 py-0.5">
              {auditLogs.length}
            </span>
          )}
        </button>
      </div>

      {loading ? (
        <div className="py-12 flex justify-center">
          <Loader size="lg" />
        </div>
      ) : activeTab === "alerts" ? (
        <div className="space-y-6">

          {/* Stock Shortage Section */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-md font-bold text-white flex items-center gap-2">
                <AlertTriangle size={18} className="text-amber-400" />
                <span>Stock Shortage Warnings</span>
                {lowStock.length > 0 && (
                  <span className="rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-bold px-2 py-0.5">{lowStock.length}</span>
                )}
              </h3>
              {lowStock.length > 0 && (
                <button
                  onClick={() => { lowStock.forEach((p) => dismiss(`low_${p._id}`)); }}
                  className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition cursor-pointer"
                >
                  <X size={13} /> Dismiss all
                </button>
              )}
            </div>

            {lowStock.length === 0 ? (
              <div className="flex flex-col items-center py-6 text-center">
                <CheckCheck size={28} className="text-emerald-500 mb-2" />
                <p className="text-sm text-slate-500">All inventory levels are safe.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {lowStock.map((p) => (
                  <div
                    key={p._id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between bg-slate-950/40 border border-slate-800 p-4 rounded-xl gap-2 group"
                  >
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-white">{p.productName}</div>
                      <div className="text-xs text-slate-400">Code: {p.productCode} | Batch: {p.batchNo}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-xs text-slate-400">
                        Stock: <span className="font-semibold text-white">{p.quantity}</span> / Min: {p.minimumStock}
                      </div>
                      <Badge variant={p.quantity === 0 ? "danger" : "warning"}>
                        {p.quantity === 0 ? "Out of Stock" : "Low Stock"}
                      </Badge>
                      <button
                        onClick={() => dismiss(`low_${p._id}`)}
                        className="opacity-0 group-hover:opacity-100 p-1 rounded-lg text-slate-500 hover:text-white hover:bg-slate-700 transition cursor-pointer"
                        title="Dismiss"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Expiry Alerts Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Expired */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-md font-bold text-white flex items-center gap-2">
                  <AlertCircle size={18} className="text-rose-500" />
                  <span>Expired Stock</span>
                  {expired.length > 0 && (
                    <span className="rounded-full bg-rose-500/20 text-rose-400 text-[10px] font-bold px-2 py-0.5">{expired.length}</span>
                  )}
                </h3>
                {expired.length > 0 && (
                  <button
                    onClick={() => { expired.forEach((p) => dismiss(`expired_${p._id}`)); }}
                    className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition cursor-pointer"
                  >
                    <X size={13} /> Dismiss all
                  </button>
                )}
              </div>

              {expired.length === 0 ? (
                <div className="flex flex-col items-center py-6 text-center">
                  <CheckCheck size={28} className="text-emerald-500 mb-2" />
                  <p className="text-sm text-slate-500">No expired stocks found.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {expired.map((p) => (
                    <div key={p._id} className="bg-rose-500/5 border border-rose-500/10 p-4 rounded-xl flex justify-between items-center group">
                      <div>
                        <div className="text-sm font-semibold text-white">{p.productName}</div>
                        <div className="text-xs text-slate-400">Batch: {p.batchNo} | Expired: {new Date(p.expiryDate).toLocaleDateString("en-IN")}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="danger">Expired</Badge>
                        <button
                          onClick={() => dismiss(`expired_${p._id}`)}
                          className="opacity-0 group-hover:opacity-100 p-1 rounded-lg text-slate-500 hover:text-white hover:bg-slate-700 transition cursor-pointer"
                          title="Dismiss"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Expiring Soon */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-md font-bold text-white flex items-center gap-2">
                  <CalendarRange size={18} className="text-blue-400" />
                  <span>Expiring Within 30 Days</span>
                  {expiringSoon.length > 0 && (
                    <span className="rounded-full bg-blue-500/20 text-blue-400 text-[10px] font-bold px-2 py-0.5">{expiringSoon.length}</span>
                  )}
                </h3>
                {expiringSoon.length > 0 && (
                  <button
                    onClick={() => { expiringSoon.forEach((p) => dismiss(`exp_soon_${p._id}`)); }}
                    className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition cursor-pointer"
                  >
                    <X size={13} /> Dismiss all
                  </button>
                )}
              </div>

              {expiringSoon.length === 0 ? (
                <div className="flex flex-col items-center py-6 text-center">
                  <CheckCheck size={28} className="text-emerald-500 mb-2" />
                  <p className="text-sm text-slate-500">No batches expiring in the next 30 days.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {expiringSoon.map((p) => (
                    <div key={p._id} className="bg-blue-500/5 border border-blue-500/10 p-4 rounded-xl flex justify-between items-center group">
                      <div>
                        <div className="text-sm font-semibold text-white">{p.productName}</div>
                        <div className="text-xs text-slate-400">Batch: {p.batchNo} | Expiry: {new Date(p.expiryDate).toLocaleDateString("en-IN")}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="info">Expiring Soon</Badge>
                        <button
                          onClick={() => dismiss(`exp_soon_${p._id}`)}
                          className="opacity-0 group-hover:opacity-100 p-1 rounded-lg text-slate-500 hover:text-white hover:bg-slate-700 transition cursor-pointer"
                          title="Dismiss"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-md font-bold text-white">ERP Security Audit Feed</h3>
              <p className="text-xs text-slate-400 mt-1">
                Chronological logging of structural changes (e.g. employee entries, inventory logging, settings configuration).
              </p>
            </div>
            {auditLogs.length > 0 && (
              <button
                onClick={() => { auditLogs.forEach((l) => dismiss(`audit_${l._id}`)); }}
                className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition cursor-pointer shrink-0"
              >
                <X size={13} /> Dismiss all
              </button>
            )}
          </div>

          {auditLogs.length === 0 ? (
            <div className="flex flex-col items-center py-8 text-center">
              <CheckCheck size={28} className="text-emerald-500 mb-2" />
              <p className="text-sm text-slate-500">No activity logs found.</p>
            </div>
          ) : (
            <div className="flow-root">
              <ul className="-mb-8">
                {auditLogs.map((log, logIdx) => (
                  <li key={log._id}>
                    <div className="relative pb-8">
                      {logIdx !== auditLogs.length - 1 ? (
                        <span className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-slate-800" aria-hidden="true" />
                      ) : null}

                      <div className="relative flex space-x-3 items-start group">
                        <div>
                          <span className="h-8 w-8 rounded-xl bg-slate-850 border border-slate-700 flex items-center justify-center text-blue-400 text-xs font-bold">
                            {log.module?.[0] || "A"}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0 pt-1.5 flex justify-between gap-4">
                          <div>
                            <p className="text-sm text-white">
                              {log.description}{" "}
                              <span className="text-slate-400 text-xs">
                                by <span className="font-semibold text-slate-300">{log.user?.fullName || "System Admin"}</span>
                              </span>
                            </p>
                            <span className="inline-flex items-center gap-1.5 rounded-md bg-slate-800 px-2 py-0.5 text-[10px] font-semibold text-slate-300 border border-slate-700 mt-1">
                              Module: {log.module} | Action: {log.action}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="text-right text-xs whitespace-nowrap text-slate-500 flex items-center gap-1">
                              <Clock size={12} />
                              <span>{new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                            <button
                              onClick={() => dismiss(`audit_${log._id}`)}
                              className="opacity-0 group-hover:opacity-100 p-1 rounded-lg text-slate-500 hover:text-white hover:bg-slate-700 transition cursor-pointer"
                              title="Dismiss"
                            >
                              <X size={13} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Notifications;
