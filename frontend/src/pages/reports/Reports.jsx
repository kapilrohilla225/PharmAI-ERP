import React, { useEffect, useState } from "react";
import { Download, BarChart2, TrendingUp, ShoppingBag, Users, Layers } from "lucide-react";
import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import toast from "react-hot-toast";
import PageHeader from "../../components/ui/PageHeader";
import Button from "../../components/ui/Button";
import Loader from "../../components/ui/Loader";
import Card from "../../components/ui/Card";
import {
  getSalesReport, getPurchaseReport, getInventoryReport,
  getEmployeeReport, downloadExcel
} from "../../services/reportService";
import { useAuth } from "../../context/AuthContext";
import { getPermissions } from "../../constants/access";

const Reports = () => {
  const { user } = useAuth();
  const role = user?.role;
  const reportPerms = getPermissions(role, "reports");
  const allowedTabs = reportPerms.tabs || [];

  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState("");

  // Data states
  const [sales, setSales] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [products, setProducts] = useState([]);
  const [employees, setEmployees] = useState([]);

  // Chart states
  const [salesChartData, setSalesChartData] = useState([]);
  const [categoryChartData, setCategoryChartData] = useState([]);
  const [salaryChartData, setSalaryChartData] = useState([]);

  const loadReports = async () => {
    setLoading(true);
    try {
      // Load only what this role is allowed to see
      const fetches = [];

      if (allowedTabs.includes("sales"))     fetches.push(getSalesReport().catch(() => null));
      else                                    fetches.push(Promise.resolve(null));

      if (allowedTabs.includes("purchases")) fetches.push(getPurchaseReport().catch(() => null));
      else                                    fetches.push(Promise.resolve(null));

      if (allowedTabs.includes("inventory")) fetches.push(getInventoryReport().catch(() => null));
      else                                    fetches.push(Promise.resolve(null));

      if (allowedTabs.includes("employees")) fetches.push(getEmployeeReport().catch(() => null));
      else                                    fetches.push(Promise.resolve(null));

      const [resSales, resPurchases, resProducts, resEmployees] = await Promise.all(fetches);

      const salesList     = resSales?.data?.data     || [];
      const purchasesList = resPurchases?.data?.data || [];
      const productsList  = resProducts?.data?.data  || [];
      const employeesList = resEmployees?.data?.data || [];

      setSales(salesList);
      setPurchases(purchasesList);
      setProducts(productsList);
      setEmployees(employeesList);

      // Sales chart data
      const salesMap = {};
      salesList.forEach((s) => {
        const name = s.product?.productName || "Unknown Product";
        salesMap[name] = (salesMap[name] || 0) + (s.totalAmount || 0);
      });
      setSalesChartData(
        Object.keys(salesMap).map((key) => ({
          name: key.length > 15 ? key.substring(0, 15) + "..." : key,
          revenue: salesMap[key],
        })).slice(0, 7)
      );

      // Category chart data
      const COLORS = ["#3b82f6", "#10b981", "#8b5cf6", "#f59e0b", "#ec4899", "#64748b"];
      const categoryMap = {};
      productsList.forEach((p) => {
        categoryMap[p.category] = (categoryMap[p.category] || 0) + 1;
      });
      setCategoryChartData(
        Object.keys(categoryMap).map((key, idx) => ({
          name: key, value: categoryMap[key], color: COLORS[idx % COLORS.length],
        }))
      );

      // Salary chart data
      const deptSalaryMap = {};
      const deptCountMap = {};
      employeesList.forEach((e) => {
        deptSalaryMap[e.department] = (deptSalaryMap[e.department] || 0) + (e.salary || 0);
        deptCountMap[e.department]  = (deptCountMap[e.department]  || 0) + 1;
      });
      setSalaryChartData(
        Object.keys(deptSalaryMap).map((key) => ({
          name: key,
          avgSalary: Math.round(deptSalaryMap[key] / deptCountMap[key]),
        }))
      );
    } catch (err) {
      console.error(err);
      toast.error("Failed to load report data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadReports(); }, []);

  const handleExportExcel = async (type) => {
    setDownloading(type);
    try {
      await downloadExcel(type);
      toast.success(`${type} Excel report exported successfully!`);
    } catch (err) {
      toast.error(`Failed to export ${type} report`);
    } finally {
      setDownloading("");
    }
  };

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-150px)] items-center justify-center bg-slate-950">
        <Loader size="lg" />
      </div>
    );
  }

  const totalSalesRevenue  = sales.reduce((sum, s) => sum + (s.totalAmount || 0), 0);
  const totalPurchasesCost = purchases.reduce((sum, p) => sum + (p.totalAmount || 0), 0);
  const stockInventoryVal  = products.reduce((sum, p) => sum + (p.quantity * p.purchasePrice), 0);
  const activeHeadcount    = employees.filter((e) => e.status === "Active").length;

  // Export buttons each role can use
  const exportButtons = [
    { key: "products",  label: "Inventory Stock",   color: "from-blue-600 to-indigo-700",    tab: "inventory" },
    { key: "sales",     label: "Sales & Billings",  color: "from-emerald-600 to-teal-700",   tab: "sales"     },
    { key: "purchases", label: "Procurements",      color: "from-rose-600 to-pink-700",      tab: "purchases" },
    { key: "employees", label: "Employee Payroll",  color: "from-purple-600 to-violet-700",  tab: "employees" },
  ].filter((btn) => allowedTabs.includes(btn.tab));

  return (
    <div className="space-y-8">
      <PageHeader
        title="Reports & Analytics"
        subtitle={
          role === "hr"
            ? "HR workforce analytics — headcount, departments, and payroll overview"
            : role === "sales"
            ? "Sales performance analytics — revenue, top products, and billing trends"
            : "Complete business analytics — financial indicators, exports, and operational overview"
        }
      />

      {/* KPI Summary Cards — filtered per role */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {allowedTabs.includes("sales") && (
          <Card className="p-5">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Revenue</p>
            <p className="mt-2 text-2xl font-bold text-white">₹{totalSalesRevenue.toLocaleString("en-IN")}</p>
          </Card>
        )}
        {allowedTabs.includes("purchases") && (
          <Card className="p-5">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Procurement Spend</p>
            <p className="mt-2 text-2xl font-bold text-white">₹{totalPurchasesCost.toLocaleString("en-IN")}</p>
          </Card>
        )}
        {allowedTabs.includes("inventory") && (
          <Card className="p-5">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Inventory Valuation</p>
            <p className="mt-2 text-2xl font-bold text-white">₹{stockInventoryVal.toLocaleString("en-IN")}</p>
          </Card>
        )}
        {allowedTabs.includes("employees") && (
          <Card className="p-5">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Active Staff</p>
            <p className="mt-2 text-2xl font-bold text-white">{activeHeadcount}</p>
          </Card>
        )}
      </div>

      {/* Metric Cards */}
      <div className={`grid grid-cols-1 gap-6 ${allowedTabs.length > 1 ? "md:grid-cols-2 xl:grid-cols-4" : "md:grid-cols-2"}`}>
        {allowedTabs.includes("sales") && (
          <div className="bg-slate-900 border border-slate-800/80 rounded-2xl p-5 flex items-center gap-4 shadow-xl">
            <div className="h-12 w-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <TrendingUp size={24} />
            </div>
            <div>
              <div className="text-xs text-slate-400">Gross Sales (INR)</div>
              <div className="text-xl font-bold text-white">₹{totalSalesRevenue.toLocaleString("en-IN")}</div>
            </div>
          </div>
        )}
        {allowedTabs.includes("purchases") && (
          <div className="bg-slate-900 border border-slate-800/80 rounded-2xl p-5 flex items-center gap-4 shadow-xl">
            <div className="h-12 w-12 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-400">
              <ShoppingBag size={24} />
            </div>
            <div>
              <div className="text-xs text-slate-400">Purchases Spent</div>
              <div className="text-xl font-bold text-white">₹{totalPurchasesCost.toLocaleString("en-IN")}</div>
            </div>
          </div>
        )}
        {allowedTabs.includes("inventory") && (
          <div className="bg-slate-900 border border-slate-800/80 rounded-2xl p-5 flex items-center gap-4 shadow-xl">
            <div className="h-12 w-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
              <Layers size={24} />
            </div>
            <div>
              <div className="text-xs text-slate-400">Inventory Valuation</div>
              <div className="text-xl font-bold text-white">₹{stockInventoryVal.toLocaleString("en-IN")}</div>
            </div>
          </div>
        )}
        {allowedTabs.includes("employees") && (
          <div className="bg-slate-900 border border-slate-800/80 rounded-2xl p-5 flex items-center gap-4 shadow-xl">
            <div className="h-12 w-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">
              <Users size={24} />
            </div>
            <div>
              <div className="text-xs text-slate-400">Active Staff Headcount</div>
              <div className="text-xl font-bold text-white">{activeHeadcount} active</div>
            </div>
          </div>
        )}
      </div>

      {/* Excel Exports — only for allowed tabs */}
      {exportButtons.length > 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
          <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
            <Download size={20} className="text-blue-500" />
            <span>Spreadsheet Exports</span>
          </h3>
          <p className="text-sm text-slate-400 mb-6">
            Download formatted Excel sheets for the reports you have access to.
          </p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {exportButtons.map((item) => (
              <button
                key={item.key}
                onClick={() => handleExportExcel(item.key)}
                disabled={downloading !== ""}
                className={`bg-linear-to-r ${item.color} text-white font-semibold rounded-2xl p-4 flex flex-col justify-between hover:scale-[1.03] transition duration-200 shadow-md text-left disabled:opacity-50 cursor-pointer`}
              >
                <span className="text-xs text-white/80">Export</span>
                <div className="flex items-center justify-between mt-3 w-full">
                  <span className="text-sm font-bold">{item.label}</span>
                  {downloading === item.key ? (
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  ) : (
                    <Download size={18} />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Charts — filtered per role */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {/* Sales Revenue Chart */}
        {allowedTabs.includes("sales") && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col h-100">
            <h4 className="text-md font-bold text-white mb-6 flex items-center gap-2">
              <BarChart2 size={18} className="text-blue-400" />
              <span>Product Revenue Breakdown (Top Sales)</span>
            </h4>
            <div className="flex-1 min-h-0">
              {salesChartData.length === 0 ? (
                <div className="h-full flex items-center justify-center text-slate-500 text-sm">No sales records to plot</div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={salesChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                    <YAxis stroke="#64748b" fontSize={11} />
                    <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "12px" }} labelStyle={{ color: "#fff", fontWeight: "bold" }} />
                    <Bar dataKey="revenue" fill="#3b82f6" radius={[8, 8, 0, 0]} name="Revenue (₹)" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        )}

        {/* Inventory Pie Chart */}
        {allowedTabs.includes("inventory") && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col h-100">
            <h4 className="text-md font-bold text-white mb-6 flex items-center gap-2">
              <BarChart2 size={18} className="text-emerald-400" />
              <span>Inventory Medicine Categories</span>
            </h4>
            <div className="flex-1 min-h-0 flex items-center justify-center">
              {categoryChartData.length === 0 ? (
                <div className="text-slate-500 text-sm">No inventory stocks registered</div>
              ) : (
                <div className="flex flex-col md:flex-row items-center justify-around w-full">
                  <div className="w-50 h-50">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={categoryChartData} cx="50%" cy="50%" innerRadius={60} outerRadius={85} paddingAngle={5} dataKey="value">
                          {categoryChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "12px", color: "#fff" }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-4 md:mt-0">
                    {categoryChartData.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs">
                        <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-slate-300">{item.name} ({item.value})</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Employee Salary Chart */}
        {allowedTabs.includes("employees") && (
          <div className={`bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col h-100 ${allowedTabs.length === 1 ? "xl:col-span-2" : "xl:col-span-2"}`}>
            <h4 className="text-md font-bold text-white mb-6 flex items-center gap-2">
              <BarChart2 size={18} className="text-purple-400" />
              <span>Average Monthly Salary by Department</span>
            </h4>
            <div className="flex-1 min-h-0">
              {salaryChartData.length === 0 ? (
                <div className="h-full flex items-center justify-center text-slate-500 text-sm">No employee data registered</div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={salaryChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                    <YAxis stroke="#64748b" fontSize={11} />
                    <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "12px" }} labelStyle={{ color: "#fff", fontWeight: "bold" }} />
                    <Bar dataKey="avgSalary" fill="#a855f7" radius={[8, 8, 0, 0]} name="Average Salary (₹)" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;
