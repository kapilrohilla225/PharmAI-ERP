import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AnimatePresence, motion } from "framer-motion";
import PageHeader from "../../components/ui/PageHeader";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import Table from "../../components/ui/Table";
import Loader from "../../components/ui/Loader";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import SearchBox from "../../components/ui/SearchBox";
import Pagination from "../../components/ui/Pagination";
import { getInventorySummary, adjustStock } from "../../services/inventoryService";
import { useAuth } from "../../context/AuthContext";
import { Boxes, AlertTriangle, Clock, Ban, TrendingUp, Package, Plus, Minus } from "lucide-react";

const Inventory = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [adjustModal, setAdjustModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [adjustValue, setAdjustValue] = useState("");
  const [adjustReason, setAdjustReason] = useState("");
  const itemsPerPage = 10;

  const fetchSummary = async () => {
    setLoading(true);
    try {
      const res = await getInventorySummary();
      setSummary(res.data.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load inventory");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSummary(); }, []);

  const handleAdjust = async () => {
    if (!adjustValue || isNaN(Number(adjustValue))) {
      toast.error("Enter a valid adjustment value");
      return;
    }
    try {
      await adjustStock({
        productId: selectedProduct._id,
        adjustment: Number(adjustValue),
        reason: adjustReason,
      });
      toast.success("Stock adjusted successfully");
      setAdjustModal(false);
      setSelectedProduct(null);
      setAdjustValue("");
      setAdjustReason("");
      fetchSummary();
    } catch (err) {
      toast.error(err.response?.data?.message || "Adjustment failed");
    }
  };

  const allProducts = summary
    ? [...(summary.lowStock || []), ...(summary.expiringSoon || []), ...(summary.expired || [])]
        .filter((v, i, a) => a.findIndex((t) => t._id === v._id) === i)
    : [];

  const filteredProducts = allProducts.filter((p) => {
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      p.productName?.toLowerCase().includes(q) ||
      p.productCode?.toLowerCase().includes(q);
    let matchesTab = true;
    if (activeTab === "low") matchesTab = summary?.lowStock?.some((s) => s._id === p._id);
    if (activeTab === "expiring") matchesTab = summary?.expiringSoon?.some((s) => s._id === p._id);
    if (activeTab === "expired") matchesTab = summary?.expired?.some((s) => s._id === p._id);
    return matchesSearch && matchesTab;
  });

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginated = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <PageHeader title="Inventory Dashboard" subtitle="Stock levels, expiry tracking, and inventory health overview" />

        {/* KPI Cards */}
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Card className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Total Products</p>
                <p className="mt-2 text-2xl font-bold text-white">{summary?.totalProducts || 0}</p>
              </div>
              <Boxes className="text-blue-400" size={22} />
            </div>
          </Card>
          <Card className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Stock Value (Cost)</p>
                <p className="mt-2 text-2xl font-bold text-white">{"\u20B9"}{(summary?.totalStockValue || 0).toLocaleString("en-IN")}</p>
              </div>
              <TrendingUp className="text-emerald-400" size={22} />
            </div>
          </Card>
          <Card className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Retail Value</p>
                <p className="mt-2 text-2xl font-bold text-white">{"\u20B9"}{(summary?.totalRetailValue || 0).toLocaleString("en-IN")}</p>
              </div>
              <Package className="text-violet-400" size={22} />
            </div>
          </Card>
          <Card className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Out of Stock</p>
                <p className="mt-2 text-2xl font-bold text-white">{summary?.outOfStockCount || 0}</p>
              </div>
              <Ban className="text-rose-400" size={22} />
            </div>
          </Card>
        </div>

        {/* Alert Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="p-5 border-l-4 border-l-amber-500">
            <div className="flex items-center gap-3">
              <AlertTriangle className="text-amber-400" size={24} />
              <div>
                <p className="text-xs uppercase tracking-wider text-slate-500">Low Stock Items</p>
                <p className="text-xl font-bold text-white">{summary?.lowStockCount || 0}</p>
              </div>
            </div>
          </Card>
          <Card className="p-5 border-l-4 border-l-orange-500">
            <div className="flex items-center gap-3">
              <Clock className="text-orange-400" size={24} />
              <div>
                <p className="text-xs uppercase tracking-wider text-slate-500">Expiring Soon (30d)</p>
                <p className="text-xl font-bold text-white">{summary?.expiringSoonCount || 0}</p>
              </div>
            </div>
          </Card>
          <Card className="p-5 border-l-4 border-l-red-500">
            <div className="flex items-center gap-3">
              <Ban className="text-red-400" size={24} />
              <div>
                <p className="text-xs uppercase tracking-wider text-slate-500">Expired Batches</p>
                <p className="text-xl font-bold text-white">{summary?.expiredCount || 0}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Tabs & Search */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center bg-slate-900/50 p-4 rounded-2xl border border-slate-800/80">
          <div className="flex gap-2 overflow-x-auto">
            {[
              { key: "all", label: "All Alerts" },
              { key: "low", label: "Low Stock" },
              { key: "expiring", label: "Expiring" },
              { key: "expired", label: "Expired" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => { setActiveTab(tab.key); setCurrentPage(1); }}
                className={`rounded-xl px-4 py-2 text-sm font-medium transition cursor-pointer ${
                  activeTab === tab.key
                    ? "bg-blue-600 text-white"
                    : "bg-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <SearchBox
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
          />
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/30">
          <Table columns={["Code", "Product", "Category", "Stock", "Min Stock", "Expiry", "Status", ...(isAdmin ? ["Actions"] : [])]}>
            {paginated.length === 0 ? (
              <tr><td colSpan={isAdmin ? 8 : 7} className="py-8 text-center text-slate-400">No items found</td></tr>
            ) : (
              paginated.map((p) => {
                const isLow = p.quantity <= p.minimumStock;
                const isExpired = new Date(p.expiryDate) < new Date();
                const daysToExpiry = Math.ceil((new Date(p.expiryDate) - new Date()) / (1000 * 60 * 60 * 24));
                return (
                  <tr key={p._id} className="border-t border-slate-800/60 hover:bg-slate-800/25 transition">
                    <td className="px-6 py-4 font-semibold text-blue-400 text-sm">{p.productCode}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-white">{p.productName}</td>
                    <td className="px-6 py-4 text-sm text-slate-300">{p.category}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-white">{p.quantity}</td>
                    <td className="px-6 py-4 text-sm text-slate-400">{p.minimumStock}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={isExpired ? "text-red-400" : daysToExpiry <= 30 ? "text-orange-400" : "text-slate-300"}>
                        {new Date(p.expiryDate).toLocaleDateString("en-IN")}
                      </span>
                      {!isExpired && daysToExpiry <= 30 && (
                        <span className="block text-[10px] text-orange-400">{daysToExpiry}d left</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {isExpired ? (
                        <Badge variant="danger">Expired</Badge>
                      ) : isLow ? (
                        <Badge variant="warning">Low Stock</Badge>
                      ) : (
                        <Badge variant="success">OK</Badge>
                      )}
                    </td>
                    {isAdmin && (
                      <td className="px-6 py-4">
                        <button
                          onClick={() => { setSelectedProduct(p); setAdjustValue(""); setAdjustReason(""); setAdjustModal(true); }}
                          className="rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 px-3 py-1.5 text-xs text-white transition font-medium flex items-center gap-1"
                        >
                          <Plus size={12} /> Adjust
                        </button>
                      </td>
                    )}
                  </tr>
                );
              })
            )}
          </Table>
        </div>

        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      </div>

      {/* Adjust Stock Modal */}
      <AnimatePresence>
        {adjustModal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setAdjustModal(false)} className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed left-1/2 top-1/2 z-[70] w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-slate-700 bg-slate-900 p-6 shadow-2xl">
              <h3 className="text-lg font-bold text-white mb-4">Adjust Stock: {selectedProduct?.productName}</h3>
              <p className="text-sm text-slate-400 mb-4">Current stock: <span className="text-white font-semibold">{selectedProduct?.quantity}</span></p>
              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-300">Adjustment (use + to add, - to subtract)</label>
                  <Input
                    type="number"
                    placeholder="e.g. 50 or -10"
                    value={adjustValue}
                    onChange={(e) => setAdjustValue(e.target.value)}
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-300">Reason</label>
                  <Input
                    placeholder="e.g. New shipment, Damaged goods"
                    value={adjustReason}
                    onChange={(e) => setAdjustReason(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setAdjustModal(false)} className="flex-1 rounded-xl border border-slate-700 bg-slate-800 py-2.5 text-sm font-semibold text-slate-300 hover:bg-slate-700 cursor-pointer">Cancel</button>
                <button onClick={handleAdjust} className="flex-1 rounded-xl bg-blue-600 py-2.5 text-sm font-semibold text-white hover:bg-blue-500 cursor-pointer">Apply</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Inventory;
