import React, { useEffect, useState, useRef } from "react";
import toast from "react-hot-toast";
import { AnimatePresence, motion } from "framer-motion";
import PageHeader from "../../components/ui/PageHeader";
import Button from "../../components/ui/Button";
import SearchBox from "../../components/ui/SearchBox";
import Table from "../../components/ui/Table";
import Badge from "../../components/ui/Badge";
import Loader from "../../components/ui/Loader";
import Pagination from "../../components/ui/Pagination";
import PurchaseDrawer from "../../components/purchase/PurchaseDrawer";
import PurchaseForm from "../../components/purchase/PurchaseForm";
import { getPurchases, updatePaymentStatus } from "../../services/purchaseService";
import Card from "../../components/ui/Card";
import { BadgeIndianRupee, Clock3, ShoppingCart, CircleCheckBig, ChevronDown, CheckCircle2, CircleDot, Circle } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

// Payment status dropdown component
const PaymentStatusDropdown = ({ purchase, onUpdated }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const ref = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const statusOptions = [
    { value: "Paid",    label: "Mark as Paid",         icon: CheckCircle2,  color: "text-emerald-400" },
    { value: "Partial", label: "Partial Payment",       icon: CircleDot,     color: "text-amber-400"   },
    { value: "Pending", label: "Reset to Pending",      icon: Circle,        color: "text-slate-400"   },
  ].filter((s) => s.value !== purchase.paymentStatus);

  const handleSelect = async (status) => {
    setOpen(false);
    setLoading(true);
    try {
      await updatePaymentStatus(purchase._id, status);
      toast.success(`Payment marked as "${status}"`);
      onUpdated();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update payment status");
    } finally {
      setLoading(false);
    }
  };

  const currentBadge = {
    Paid:    { variant: "success", label: "Paid"    },
    Pending: { variant: "warning", label: "Pending" },
    Partial: { variant: "warning", label: "Partial" },
  }[purchase.paymentStatus] || { variant: "secondary", label: purchase.paymentStatus };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        disabled={loading}
        className="flex items-center gap-1.5 group cursor-pointer"
        title="Click to change payment status"
      >
        <Badge variant={currentBadge.variant}>{loading ? "…" : currentBadge.label}</Badge>
        <ChevronDown
          size={12}
          className={`text-slate-500 transition-transform group-hover:text-white ${open ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0,  scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 top-full mt-2 z-50 min-w-[180px] rounded-xl border border-slate-700 bg-slate-900 shadow-2xl shadow-black/50 overflow-hidden"
          >
            <div className="p-1.5 space-y-0.5">
              {statusOptions.map((opt) => {
                const Icon = opt.icon;
                return (
                  <button
                    key={opt.value}
                    onClick={() => handleSelect(opt.value)}
                    className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition hover:bg-slate-800 cursor-pointer"
                  >
                    <Icon size={14} className={opt.color} />
                    <span className="text-slate-200">{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ─── Main Page ───────────────────────────────────────────────────────────────
const Purchases = () => {
  const { user } = useAuth();
  const canCreate = user?.role === "admin";

  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const fetchPurchases = async () => {
    setLoading(true);
    try {
      const res = await getPurchases();
      setPurchases(res.data.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load purchases history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPurchases(); }, []);

  const filteredPurchases = purchases.filter((p) => {
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      p.supplierName?.toLowerCase().includes(q) ||
      p.purchaseNumber?.toLowerCase().includes(q) ||
      p.product?.productName?.toLowerCase().includes(q);
    const matchesStatus = filterStatus === "All" || p.paymentStatus === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const totalPages    = Math.ceil(filteredPurchases.length / itemsPerPage);
  const startIndex    = (currentPage - 1) * itemsPerPage;
  const paginated     = filteredPurchases.slice(startIndex, startIndex + itemsPerPage);

  const totalSpent     = filteredPurchases.reduce((s, p) => s + (p.totalAmount || 0), 0);
  const paidCount      = filteredPurchases.filter((p) => p.paymentStatus === "Paid").length;
  const pendingCount   = filteredPurchases.filter((p) => p.paymentStatus === "Pending").length;
  const partialCount   = filteredPurchases.filter((p) => p.paymentStatus === "Partial").length;
  const avgOrder       = filteredPurchases.length ? totalSpent / filteredPurchases.length : 0;

  return (
    <>
      <div className="space-y-6">
        <PageHeader
          title="Procurement Ledger"
          subtitle="Track supplier orders, payment states, and stock inflow from a single operational view"
        >
          {canCreate && (
            <Button className="w-auto px-6 py-2.5 text-sm" onClick={() => setOpen(true)}>
              + Record Purchase
            </Button>
          )}
        </PageHeader>

        {/* KPI Cards */}
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Card className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Total Orders</p>
                <p className="mt-2 text-2xl font-bold text-white">{filteredPurchases.length}</p>
              </div>
              <ShoppingCart className="text-blue-400" size={22} />
            </div>
          </Card>
          <Card className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Paid</p>
                <p className="mt-2 text-2xl font-bold text-white">{paidCount}</p>
              </div>
              <CircleCheckBig className="text-emerald-400" size={22} />
            </div>
          </Card>
          <Card className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Pending / Partial</p>
                <p className="mt-2 text-2xl font-bold text-white">{pendingCount + partialCount}</p>
              </div>
              <Clock3 className="text-amber-400" size={22} />
            </div>
          </Card>
          <Card className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Avg. Order Value</p>
                <p className="mt-2 text-2xl font-bold text-white">₹{avgOrder.toLocaleString("en-IN", { maximumFractionDigits: 0 })}</p>
              </div>
              <BadgeIndianRupee className="text-purple-400" size={22} />
            </div>
          </Card>
        </div>

        {/* Pending payments alert */}
        {(pendingCount + partialCount) > 0 && (
          <div className="flex items-center gap-3 rounded-2xl border border-amber-500/25 bg-amber-500/8 px-4 py-3 text-sm text-amber-200">
            <Clock3 size={16} className="shrink-0 text-amber-400" />
            <span>
              <span className="font-semibold">{pendingCount + partialCount}</span> purchase{pendingCount + partialCount > 1 ? "s" : ""} {pendingCount + partialCount > 1 ? "have" : "has"} pending or partial payments.
              Click the status badge in the table to update payment.
            </span>
          </div>
        )}

        {/* Toolbar */}
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between bg-slate-900/50 p-4 rounded-2xl border border-slate-800/80 backdrop-blur-md">
          <SearchBox
            placeholder="Search supplier, item name, order ID..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
          />
          <div className="flex items-center gap-2 flex-wrap">
            {["All", "Pending", "Partial", "Paid"].map((s) => (
              <button
                key={s}
                onClick={() => { setFilterStatus(s); setCurrentPage(1); }}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition cursor-pointer ${
                  filterStatus === s
                    ? "bg-blue-600 text-white"
                    : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white border border-slate-700"
                }`}
              >
                {s}
              </button>
            ))}
            <span className="text-sm text-slate-400 ml-2">
              {filteredPurchases.length} orders
            </span>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/30">
          <Table
            columns={[
              "Purchase ID",
              "Supplier Details",
              "Product Procured",
              "Date",
              "Cost / Qty",
              "Total Amount",
              "Payment Status",
            ]}
          >
            {loading ? (
              <tr><td colSpan={7} className="py-8 text-center"><Loader size="md" /></td></tr>
            ) : paginated.length === 0 ? (
              <tr><td colSpan={7} className="py-8 text-center text-slate-400">No Purchase Orders Found</td></tr>
            ) : (
              paginated.map((p) => (
                <tr key={p._id} className="border-t border-slate-800/60 hover:bg-slate-800/25 transition duration-150">
                  <td className="px-6 py-4 font-semibold text-blue-400 text-sm">{p.purchaseNumber}</td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-semibold text-white">{p.supplierName}</div>
                    {p.supplierPhone && <div className="text-xs text-slate-400">Ph: {p.supplierPhone}</div>}
                  </td>
                  <td className="px-6 py-4">
                    {p.product ? (
                      <>
                        <div className="text-sm text-white font-medium">{p.product.productName}</div>
                        <div className="text-xs text-slate-400">Code: {p.product.productCode}</div>
                      </>
                    ) : (
                      <span className="text-sm text-rose-400 italic">Deleted Product</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-slate-300 text-sm">
                    {p.purchaseDate ? new Date(p.purchaseDate).toLocaleDateString("en-IN") : "-"}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-300">
                    <div>Rate: <span className="text-white">₹{p.purchasePrice}</span></div>
                    <div>Qty: <span className="text-white font-semibold">{p.quantity} units</span></div>
                  </td>
                  <td className="px-6 py-4 text-emerald-400 font-bold text-sm">
                    ₹{p.totalAmount?.toLocaleString("en-IN")}
                  </td>
                  <td className="px-6 py-4">
                    {/* Clickable dropdown to change status */}
                    <PaymentStatusDropdown purchase={p} onUpdated={fetchPurchases} />
                  </td>
                </tr>
              ))
            )}
          </Table>
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>

      {canCreate && (
        <PurchaseDrawer open={open} onClose={() => setOpen(false)} title="Record Stock Purchase">
          <div className="mb-4">
            <p className="text-sm text-slate-400">
              Log supplier shipments to update quantities in local active stock automatically.
            </p>
          </div>
          <PurchaseForm onSuccess={fetchPurchases} onClose={() => setOpen(false)} />
        </PurchaseDrawer>
      )}
    </>
  );
};

export default Purchases;