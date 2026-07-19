import React, { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { ShieldCheck, Users, TrendingUp, UserCircle, BarChart3, Briefcase, CalendarDays } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../components/ui/PageHeader";
import StatCardsSection from "../../components/dashboard/StatCardsSection";
import SalesAreaChart from "../../components/charts/AreaChart";
import QuickActions from "../../components/dashboard/QuickActions";
import LowStockCard from "../../components/dashboard/LowStockCard";
import RecentActivity from "../../components/dashboard/RecentActivity";
import RevenueOverview from "../../components/dashboard/RevenueOverview";
import RecentSales from "../../components/dashboard/RecentSales";
import Loader from "../../components/ui/Loader";
import { getDashboardStats } from "../../services/dashboardService";
import { getNotifications } from "../../services/notificationService";
import { getSales } from "../../services/saleService";
import { getPurchases } from "../../services/purchaseService";
import { getEmployees } from "../../services/employeeService";
import { useAuth } from "../../context/AuthContext";
import { getRoleLabel, getPermissions } from "../../constants/access";

// ─── HR Dashboard ────────────────────────────────────────────────────────────
const HRDashboard = ({ employees, user }) => {
  const total    = employees.length;
  const active   = employees.filter((e) => e.status === "Active").length;
  const inactive = total - active;
  const deptMap  = employees.reduce((acc, e) => {
    acc[e.department] = (acc[e.department] || 0) + 1;
    return acc;
  }, {});
  const topDept = Object.entries(deptMap).sort((a, b) => b[1] - a[1])[0];

  const now       = new Date();
  const thisMonth = employees.filter((e) => {
    const d = new Date(e.joiningDate);
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
  }).length;

  return (
    <div className="space-y-6 pb-8">
      <PageHeader
        title="HR Dashboard"
        subtitle={`Welcome, ${user?.fullName?.split(" ")[0]} — Workforce overview`}
      >
        <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/20 bg-purple-500/10 px-4 py-1.5 text-xs font-semibold text-purple-300">
          <Users size={14} />
          HR Access
        </div>
      </PageHeader>

      <div className="grid gap-5 grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Total Employees", value: total,     icon: Briefcase,     color: "text-sky-400"     },
          { label: "Active",          value: active,    icon: Users,         color: "text-emerald-400" },
          { label: "Inactive",        value: inactive,  icon: UserCircle,    color: "text-rose-400"    },
          { label: "Joined This Month",value: thisMonth,icon: CalendarDays,  color: "text-purple-400"  },
        ].map((card) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-slate-800 bg-slate-900 p-5"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-400">{card.label}</p>
                  <p className={`mt-3 text-3xl font-bold ${card.color}`}>{card.value}</p>
                </div>
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-slate-800 ${card.color}`}>
                  <Icon size={20} />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h3 className="mb-5 text-lg font-bold text-white flex items-center gap-2">
            <BarChart3 size={18} className="text-blue-400" />
            Department Headcount
          </h3>
          <div className="space-y-3">
            {Object.entries(deptMap).sort((a, b) => b[1] - a[1]).map(([dept, count]) => (
              <div key={dept} className="flex items-center gap-3">
                <div className="w-24 text-sm text-slate-300 truncate">{dept || "Unassigned"}</div>
                <div className="flex flex-1 items-center gap-2">
                  <div className="h-2.5 rounded-full bg-gradient-to-r from-blue-500 to-blue-600" style={{ width: `${(count / total) * 100}%` }} />
                  <span className="text-xs font-semibold text-white w-6 text-right">{count}</span>
                </div>
              </div>
            ))}
            {Object.keys(deptMap).length === 0 && (
              <p className="text-sm text-slate-500">No employee records yet</p>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h3 className="mb-5 text-lg font-bold text-white flex items-center gap-2">
            <Users size={18} className="text-purple-400" />
            HR Quick Info
          </h3>
          <div className="space-y-3">
            {[
              { label: "Largest Department", value: topDept ? `${topDept[0]} (${topDept[1]})` : "—" },
              { label: "New Joiners This Month", value: thisMonth },
              { label: "Active Rate", value: total > 0 ? `${Math.round((active / total) * 100)}%` : "—" },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between rounded-xl border border-slate-700/60 bg-slate-800/40 px-4 py-3">
                <span className="text-sm text-slate-400">{item.label}</span>
                <span className="text-sm font-semibold text-white">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <h3 className="mb-5 text-lg font-bold text-white">Recent Employees</h3>
        <div className="overflow-x-auto -mx-6 px-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-500 text-xs uppercase tracking-wider">
                <th className="pb-3 font-medium">Name</th>
                <th className="pb-3 font-medium">Department</th>
                <th className="pb-3 font-medium">Designation</th>
                <th className="pb-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {employees.slice(0, 5).map((emp) => (
                <tr key={emp._id} className="border-t border-slate-800/60">
                  <td className="py-3.5 text-white font-medium">{emp.fullName}</td>
                  <td className="py-3.5 text-slate-400">{emp.department}</td>
                  <td className="py-3.5 text-slate-400">{emp.designation}</td>
                  <td className="py-3.5">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${emp.status === "Active" ? "bg-emerald-500/10 text-emerald-400" : "bg-slate-700 text-slate-400"}`}>
                      {emp.status}
                    </span>
                  </td>
                </tr>
              ))}
              {employees.length === 0 && (
                <tr><td colSpan={4} className="py-8 text-center text-slate-500">No employees yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// ─── Sales Dashboard ──────────────────────────────────────────────────────────
const SalesDashboard = ({ sales, user, roleLabel }) => {
  const today    = new Date();
  const todayStr = today.toDateString();

  const todaySales = sales.filter((s) => new Date(s.createdAt).toDateString() === todayStr);
  const todayRevenue = todaySales.reduce((sum, s) => sum + (s.totalAmount || 0), 0);

  const thisMonth = today.getMonth();
  const thisYear  = today.getFullYear();
  const monthSales = sales.filter((s) => {
    const d = new Date(s.createdAt);
    return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
  });
  const monthRevenue = monthSales.reduce((sum, s) => sum + (s.totalAmount || 0), 0);

  const productMap = {};
  sales.forEach((s) => {
    const name = s.product?.productName || s.productName || "Unknown";
    productMap[name] = (productMap[name] || 0) + (s.totalAmount || 0);
  });
  const topProducts = Object.entries(productMap).sort((a, b) => b[1] - a[1]).slice(0, 5);

  return (
    <div className="space-y-6 pb-8">
      <PageHeader
        title="Sales Dashboard"
        subtitle={`Welcome, ${user?.fullName?.split(" ")[0]} — Your sales overview`}
      >
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-1.5 text-xs font-semibold text-blue-300">
          <TrendingUp size={14} />
          {roleLabel}
        </div>
      </PageHeader>

      <div className="grid gap-5 grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Today's Sales",   value: todaySales.length,                         icon: TrendingUp,     color: "text-sky-400"     },
          { label: "Today's Revenue", value: `₹${todayRevenue.toLocaleString("en-IN")}`, icon: TrendingUp,     color: "text-emerald-400" },
          { label: "Monthly Sales",   value: monthSales.length,                          icon: TrendingUp,     color: "text-purple-400"  },
          { label: "Monthly Revenue", value: `₹${monthRevenue.toLocaleString("en-IN")}`, icon: TrendingUp,     color: "text-orange-400"  },
        ].map((card) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-slate-800 bg-slate-900 p-5"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-400">{card.label}</p>
                  <p className={`mt-3 text-2xl font-bold ${card.color}`}>{card.value}</p>
                </div>
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-slate-800 ${card.color}`}>
                  <Icon size={20} />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2 rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="mb-5 text-lg font-bold text-white">Monthly Sales Revenue (This Year)</h2>
          <SalesAreaChart sales={sales} />
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h3 className="mb-5 text-lg font-bold text-white flex items-center gap-2">
            <TrendingUp size={18} className="text-emerald-400" />
            Top Products
          </h3>
          <div className="space-y-3">
            {topProducts.map(([name, revenue], i) => (
              <div key={name} className="flex items-center justify-between py-2 border-b border-slate-800/60 last:border-0">
                <div className="flex items-center gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-md bg-slate-800 text-xs font-bold text-slate-400">#{i + 1}</span>
                  <span className="text-sm text-slate-300 truncate max-w-[120px]">{name}</span>
                </div>
                <span className="text-sm font-semibold text-emerald-400">₹{revenue.toLocaleString("en-IN")}</span>
              </div>
            ))}
            {topProducts.length === 0 && (
              <p className="text-sm text-slate-500">No sales data yet</p>
            )}
          </div>
        </div>
      </div>

      <RecentSales sales={sales} />
    </div>
  );
};

// ─── Employee Dashboard ───────────────────────────────────────────────────────
const EmployeeDashboard = ({ user, roleLabel }) => {
  const navigate = useNavigate();
  return (
    <div className="space-y-6 pb-8">
      <PageHeader
        title="My Dashboard"
        subtitle="Your personal workspace"
      >
        <div className="inline-flex items-center gap-2 rounded-full border border-slate-600 bg-slate-800 px-4 py-1.5 text-xs font-semibold text-slate-300">
          <UserCircle size={14} />
          Employee Access
        </div>
      </PageHeader>

      <div className="grid gap-6 xl:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-slate-800 bg-slate-900 p-6"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600/20 text-blue-400">
              <UserCircle size={30} />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Logged in as</p>
              <h2 className="text-xl font-bold text-white">{user?.fullName}</h2>
              <p className="text-sm text-slate-400">{roleLabel}</p>
            </div>
          </div>
          <div className="space-y-3">
            {[
              { label: "Email",       value: user?.email    },
              { label: "Role",        value: roleLabel       },
              { label: "Phone",       value: user?.phone || "—" },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between rounded-xl border border-slate-700/60 bg-slate-800/40 px-4 py-3">
                <span className="text-sm text-slate-400">{item.label}</span>
                <span className="text-sm font-semibold text-white">{item.value}</span>
              </div>
            ))}
          </div>
          <button
            onClick={() => navigate("/profile")}
            className="mt-6 w-full rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white transition hover:bg-blue-500"
          >
            Edit My Profile
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl border border-slate-800 bg-slate-900 p-6 flex flex-col items-center justify-center text-center gap-4"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-400">
            <ShieldCheck size={32} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Limited Access Profile</h3>
            <p className="mt-2 text-sm text-slate-400 max-w-sm">
              You have employee-level access. You can view products and update your profile. Contact your HR or Admin for any changes.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-2 mt-2">
            {["View Products", "My Profile", "Notifications", "Change Password"].map((t) => (
              <span key={t} className="rounded-full border border-slate-700 bg-slate-950 px-3 py-1 text-xs text-slate-400">{t}</span>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// ─── Main Dashboard (Admin) ───────────────────────────────────────────────────
const AdminDashboard = ({ stats, sales, purchases, lowStock, recentActivities, user, roleLabel, accessibleModules }) => {
  const firstName   = user?.fullName?.split(" ")[0] || "User";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6 pb-8"
    >
      <PageHeader
        title="Dashboard"
        subtitle={`Welcome back, ${firstName} — Here's your business overview`}
      >
        <div className="flex items-center gap-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-1.5 text-xs font-semibold text-blue-300">
            <ShieldCheck size={14} />
            {roleLabel}
          </div>
          <div className="rounded-full border border-slate-700 bg-slate-800 px-4 py-1.5 text-xs font-semibold text-slate-300">
            {accessibleModules.length} Modules
          </div>
        </div>
      </PageHeader>

      <StatCardsSection stats={stats} />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2 rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="mb-5 text-lg font-bold text-white">Sales Revenue (This Year)</h2>
          <SalesAreaChart sales={sales} />
        </div>
        <QuickActions />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <RecentSales sales={sales} />
        <LowStockCard products={lowStock} />
        <RevenueOverview sales={sales} purchases={purchases} />
      </div>

      <RecentActivity activities={recentActivities} />
    </motion.div>
  );
};

// ─── Dashboard Entry Point ────────────────────────────────────────────────────
const Dashboard = () => {
  const { user, roleLabel, accessibleModules } = useAuth();
  const role = user?.role;

  const [loading, setLoading]               = useState(true);
  const [stats, setStats]                   = useState(null);
  const [lowStock, setLowStock]             = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [sales, setSales]                   = useState([]);
  const [purchases, setPurchases]           = useState([]);
  const [employees, setEmployees]           = useState([]);

  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      const fetches = [];

      // Admin: fetch everything
      if (role === "admin") {
        fetches.push(
          getDashboardStats().catch(() => null),
          getNotifications().catch(() => null),
          getSales().catch(() => null),
          getPurchases().catch(() => null),
        );
        const [resStats, resAlerts, resSales, resPurchases] = await Promise.all(fetches);
        if (resStats)    setStats(resStats.data.data);
        if (resAlerts)   {
          const d = resAlerts.data.data || {};
          setLowStock(d.lowStock || []);
          setRecentActivities(d.recentActivities || []);
        }
        if (resSales)    setSales(resSales.data.data || []);
        if (resPurchases)setPurchases(resPurchases.data.data || []);
      }

      // HR: fetch employees only
      if (role === "hr") {
        const res = await getEmployees().catch(() => null);
        if (res) setEmployees(res.data.data || []);
      }

      // Sales: fetch sales only
      if (role === "sales") {
        const res = await getSales().catch(() => null);
        if (res) setSales(res.data.data || []);
      }

      // Employee: no extra data needed
    } catch (err) {
      console.error(err);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  }, [role]);

  useEffect(() => { loadAll(); }, [loadAll]);

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-150px)] items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  if (role === "hr") {
    return <HRDashboard employees={employees} user={user} />;
  }

  if (role === "sales") {
    return <SalesDashboard sales={sales} user={user} roleLabel={roleLabel} />;
  }

  if (role === "employee") {
    return <EmployeeDashboard user={user} roleLabel={roleLabel} />;
  }

  // Admin
  return (
    <AdminDashboard
      stats={stats}
      sales={sales}
      purchases={purchases}
      lowStock={lowStock}
      recentActivities={recentActivities}
      user={user}
      roleLabel={roleLabel}
      accessibleModules={accessibleModules}
    />
  );
};

export default Dashboard;