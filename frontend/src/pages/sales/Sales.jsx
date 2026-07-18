import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { ReceiptText } from "lucide-react";
import PageHeader from "../../components/ui/PageHeader";
import Button from "../../components/ui/Button";
import SearchBox from "../../components/ui/SearchBox";
import Table from "../../components/ui/Table";
import Badge from "../../components/ui/Badge";
import Loader from "../../components/ui/Loader";
import Pagination from "../../components/ui/Pagination";
import SaleDrawer from "../../components/sales/SaleDrawer";
import SaleForm from "../../components/sales/SaleForm";
import { getSales, downloadInvoice } from "../../services/saleService";
import { useAuth } from "../../context/AuthContext";
import { getPermissions } from "../../constants/access";

const Sales = () => {
  const { user } = useAuth();
  const perms = getPermissions(user?.role, "sales");

  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Track which invoice is downloading
  const [downloadingId, setDownloadingId] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const fetchSales = async () => {
    setLoading(true);
    try {
      const res = await getSales();
      setSales(res.data.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load sales history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSales(); }, []);

  const handleDownloadInvoice = async (sale) => {
    setDownloadingId(sale._id);
    try {
      await downloadInvoice(sale._id, sale.invoiceNumber);
      toast.success(`Invoice ${sale.invoiceNumber} downloaded`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to download invoice PDF");
    } finally {
      setDownloadingId(null);
    }
  };

  const filteredSales = sales.filter((s) => {
    const q = searchTerm.toLowerCase();
    return (
      s.customerName?.toLowerCase().includes(q) ||
      s.invoiceNumber?.toLowerCase().includes(q) ||
      s.product?.productName?.toLowerCase().includes(q)
    );
  });

  const totalPages     = Math.ceil(filteredSales.length / itemsPerPage);
  const startIndex     = (currentPage - 1) * itemsPerPage;
  const paginatedSales = filteredSales.slice(startIndex, startIndex + itemsPerPage);

  const getMethodBadge = (method) => {
    if (method === "UPI") return "info";
    if (method === "Card") return "secondary";
    return "success";
  };

  // Build columns — hide Print column if role can't access invoices
  const columns = [
    "Invoice No",
    "Customer Details",
    "Product Sold",
    "Billing Date",
    "Price / Qty",
    "Total Amount",
    "Payment Method",
    ...(perms.canInvoice ? ["Print"] : []),
  ];

  return (
    <>
      <div className="space-y-6">
        <PageHeader
          title="Sales & Invoicing"
          subtitle="Generate retail customer bills, trace pharmacy invoices, and issue PDF prints"
        >
          {perms.canCreate && (
            <Button className="w-auto px-6 py-2.5 text-sm" onClick={() => setOpen(true)}>
              + Create New Invoice
            </Button>
          )}
        </PageHeader>

        {/* View-only banner for HR */}
        {user?.role === "hr" && (
          <div className="rounded-2xl border border-blue-500/20 bg-blue-500/10 px-4 py-3 text-sm text-blue-200">
            HR view — sales data is read-only for your role. Invoice creation and PDF downloads are restricted.
          </div>
        )}

        {/* Toolbar */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between bg-slate-900/50 p-4 rounded-2xl border border-slate-800/80 backdrop-blur-md">
          <SearchBox
            placeholder="Search invoice ID, customer, medicine name..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
          />
          <div className="text-sm text-slate-400">
            Total Bills Issued: <span className="font-semibold text-white">{filteredSales.length}</span>
          </div>
        </div>

        {/* Table View */}
        <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/30">
          <Table columns={columns}>
            {loading ? (
              <tr><td colSpan={columns.length} className="py-8 text-center text-slate-400"><Loader size="md" /></td></tr>
            ) : paginatedSales.length === 0 ? (
              <tr><td colSpan={columns.length} className="py-8 text-center text-slate-400">No Sales Invoices Found</td></tr>
            ) : (
              paginatedSales.map((s) => (
                <tr key={s._id} className="border-t border-slate-800/60 hover:bg-slate-800/25 transition duration-150">
                  <td className="px-6 py-4 font-semibold text-blue-400 text-sm">{s.invoiceNumber}</td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-semibold text-white">{s.customerName}</div>
                    {s.customerPhone && <div className="text-xs text-slate-400">Ph: {s.customerPhone}</div>}
                  </td>
                  <td className="px-6 py-4">
                    {s.product ? (
                      <>
                        <div className="text-sm text-white font-medium">{s.product.productName}</div>
                        <div className="text-xs text-slate-400">Code: {s.product.productCode}</div>
                      </>
                    ) : (
                      <span className="text-sm text-rose-400 italic">Deleted Product</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-slate-300 text-sm">
                    {s.createdAt ? new Date(s.createdAt).toLocaleDateString("en-IN") : "-"}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-300">
                    <div>Rate: <span className="text-white">₹{s.sellingPrice}</span></div>
                    <div>Qty: <span className="text-white font-semibold">{s.quantity} units</span></div>
                  </td>
                  <td className="px-6 py-4 text-emerald-400 font-bold text-sm">
                    ₹{s.totalAmount?.toLocaleString("en-IN")}
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={getMethodBadge(s.paymentMethod)}>{s.paymentMethod}</Badge>
                  </td>
                  {perms.canInvoice && (
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleDownloadInvoice(s)}
                        disabled={downloadingId === s._id}
                        className="rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 p-2 text-white transition disabled:opacity-50 flex items-center justify-center"
                        title="Download PDF Invoice"
                      >
                        {downloadingId === s._id ? (
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        ) : (
                          <ReceiptText size={16} />
                        )}
                      </button>
                    </td>
                  )}
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

      {perms.canCreate && (
        <SaleDrawer open={open} onClose={() => setOpen(false)} title="Issue Retail Sale Invoice">
          <div className="mb-4">
            <p className="text-sm text-slate-400">
              Deduct medicine quantities and issue retail customer receipts instantly.
            </p>
          </div>
          <SaleForm onSuccess={fetchSales} onClose={() => setOpen(false)} />
        </SaleDrawer>
      )}
    </>
  );
};

export default Sales;