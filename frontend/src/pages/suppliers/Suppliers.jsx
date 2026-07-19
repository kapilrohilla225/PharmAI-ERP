import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { AnimatePresence, motion } from "framer-motion";
import PageHeader from "../../components/ui/PageHeader";
import Button from "../../components/ui/Button";
import SearchBox from "../../components/ui/SearchBox";
import Select from "../../components/ui/Select";
import Table from "../../components/ui/Table";
import Badge from "../../components/ui/Badge";
import Loader from "../../components/ui/Loader";
import Pagination from "../../components/ui/Pagination";
import Input from "../../components/ui/Input";
import Card from "../../components/ui/Card";
import { getSuppliers, createSupplier, updateSupplier, deleteSupplier } from "../../services/supplierService";
import { useAuth } from "../../context/AuthContext";
import { getPermissions } from "../../constants/access";
import { Truck, Plus, Pencil, Trash2, Building2, Phone, Mail } from "lucide-react";

const SupplierForm = ({ supplier, onSuccess, onClose }) => {
  const [formData, setFormData] = useState({
    name: supplier?.name || "",
    email: supplier?.email || "",
    phone: supplier?.phone || "",
    address: supplier?.address || "",
    city: supplier?.city || "",
    state: supplier?.state || "",
    gstNumber: supplier?.gstNumber || "",
    contactPerson: supplier?.contactPerson || "",
    status: supplier?.status || "Active",
    notes: supplier?.notes || "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) {
      toast.error("Name and phone are required");
      return;
    }
    setLoading(true);
    try {
      if (supplier) {
        await updateSupplier(supplier._id, formData);
        toast.success("Supplier updated successfully");
      } else {
        await createSupplier(formData);
        toast.success("Supplier created successfully");
      }
      onSuccess();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-300">Company Name *</label>
          <Input name="name" placeholder="Supplier company name" value={formData.name} onChange={handleChange} />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-300">Contact Person</label>
          <Input name="contactPerson" placeholder="Contact person name" value={formData.contactPerson} onChange={handleChange} />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-300">Phone *</label>
          <Input name="phone" placeholder="+91 XXXXX XXXXX" value={formData.phone} onChange={handleChange} />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-300">Email</label>
          <Input name="email" type="email" placeholder="supplier@example.com" value={formData.email} onChange={handleChange} />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-300">GST Number</label>
          <Input name="gstNumber" placeholder="GST Number" value={formData.gstNumber} onChange={handleChange} />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-300">Status</label>
          <Select
            name="status"
            value={formData.status}
            onChange={handleChange}
            options={[
              { value: "Active", label: "Active" },
              { value: "Inactive", label: "Inactive" },
            ]}
          />
        </div>
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-300">Address</label>
        <Input name="address" placeholder="Full address" value={formData.address} onChange={handleChange} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-300">City</label>
          <Input name="city" placeholder="City" value={formData.city} onChange={handleChange} />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-300">State</label>
          <Input name="state" placeholder="State" value={formData.state} onChange={handleChange} />
        </div>
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-300">Notes</label>
        <textarea
          name="notes"
          placeholder="Additional notes"
          value={formData.notes}
          onChange={handleChange}
          rows={2}
          className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />
      </div>
      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onClose} className="flex-1 rounded-xl border border-slate-700 bg-slate-800 py-2.5 text-sm font-semibold text-slate-300 hover:bg-slate-700 cursor-pointer">
          Cancel
        </button>
        <button type="submit" disabled={loading} className="flex-1 rounded-xl bg-blue-600 py-2.5 text-sm font-semibold text-white hover:bg-blue-500 disabled:opacity-50 cursor-pointer">
          {loading ? "Saving..." : supplier ? "Update Supplier" : "Create Supplier"}
        </button>
      </div>
    </form>
  );
};

const Suppliers = () => {
  const { user } = useAuth();
  const perms = getPermissions(user?.role, "products");
  const canWrite = user?.role === "admin" || user?.role === "hr";

  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchSuppliers = async () => {
    setLoading(true);
    try {
      const res = await getSuppliers({ search: searchTerm, status: statusFilter });
      setSuppliers(res.data.data?.suppliers || res.data.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load suppliers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSuppliers(); }, [searchTerm, statusFilter]);

  const handleDelete = async (supplier) => {
    if (user?.role !== "admin") {
      toast.error("Only administrators can delete suppliers");
      return;
    }
    const result = await Swal.fire({
      title: "Delete Supplier?",
      text: `This will permanently remove ${supplier.name}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete",
      background: "#1e293b",
      color: "#ffffff",
    });
    if (result.isConfirmed) {
      try {
        await deleteSupplier(supplier._id);
        toast.success("Supplier deleted");
        fetchSuppliers();
      } catch (err) {
        toast.error(err.response?.data?.message || "Delete failed");
      }
    }
  };

  const filtered = suppliers.filter((s) => {
    const q = searchTerm.toLowerCase();
    return (
      s.name?.toLowerCase().includes(q) ||
      s.supplierCode?.toLowerCase().includes(q) ||
      s.email?.toLowerCase().includes(q) ||
      s.phone?.includes(q)
    );
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <>
      <div className="space-y-6">
        <PageHeader title="Supplier Management" subtitle="Manage pharmaceutical suppliers, contacts, and procurement partners">
          {canWrite && (
            <Button className="w-auto px-6 py-2.5 text-sm" onClick={() => { setSelectedSupplier(null); setOpen(true); }}>
              <span className="flex items-center gap-1.5"><Plus size={16} /> Add Supplier</span>
            </Button>
          )}
        </PageHeader>

        {/* KPIs */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Total Suppliers</p>
                <p className="mt-2 text-2xl font-bold text-white">{suppliers.length}</p>
              </div>
              <Truck className="text-blue-400" size={22} />
            </div>
          </Card>
          <Card className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Active</p>
                <p className="mt-2 text-2xl font-bold text-white">{suppliers.filter((s) => s.status === "Active").length}</p>
              </div>
              <Building2 className="text-emerald-400" size={22} />
            </div>
          </Card>
          <Card className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Inactive</p>
                <p className="mt-2 text-2xl font-bold text-white">{suppliers.filter((s) => s.status === "Inactive").length}</p>
              </div>
              <Building2 className="text-rose-400" size={22} />
            </div>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center bg-slate-900/50 p-4 rounded-2xl border border-slate-800/80">
          <SearchBox placeholder="Search suppliers..." value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }} />
          <Select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
            options={[
              { value: "", label: "All Status" },
              { value: "Active", label: "Active" },
              { value: "Inactive", label: "Inactive" },
            ]}
          />
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/30">
          <Table columns={["Code", "Supplier Name", "Contact", "City", "GST", "Status", ...(canWrite ? ["Actions"] : [])]}>
            {loading ? (
              <tr><td colSpan={canWrite ? 7 : 6} className="py-8 text-center"><Loader size="md" /></td></tr>
            ) : paginated.length === 0 ? (
              <tr><td colSpan={canWrite ? 7 : 6} className="py-8 text-center text-slate-400">No suppliers found</td></tr>
            ) : (
              paginated.map((s) => (
                <tr key={s._id} className="border-t border-slate-800/60 hover:bg-slate-800/25 transition">
                  <td className="px-6 py-4 font-semibold text-blue-400 text-sm">{s.supplierCode}</td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-semibold text-white">{s.name}</div>
                    {s.contactPerson && <div className="text-xs text-slate-400">{s.contactPerson}</div>}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex items-center gap-1 text-slate-300"><Phone size={12} /> {s.phone}</div>
                    {s.email && <div className="flex items-center gap-1 text-slate-400 text-xs"><Mail size={10} /> {s.email}</div>}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-300">{s.city || "-"}</td>
                  <td className="px-6 py-4 text-sm text-slate-400">{s.gstNumber || "-"}</td>
                  <td className="px-6 py-4">
                    <Badge variant={s.status === "Active" ? "success" : "danger"}>{s.status}</Badge>
                  </td>
                  {canWrite && (
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button onClick={() => { setSelectedSupplier(s); setOpen(true); }} className="rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 px-3 py-1.5 text-xs text-white transition font-medium">
                          <Pencil size={12} />
                        </button>
                        {user?.role === "admin" && (
                          <button onClick={() => handleDelete(s)} className="rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 px-3 py-1.5 text-xs text-red-400 transition font-medium">
                            <Trash2 size={12} />
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </Table>
        </div>

        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      </div>

      {/* Drawer Modal */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)} className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 30, stiffness: 300 }} className="fixed right-0 top-0 z-[70] h-full w-full max-w-lg overflow-y-auto border-l border-slate-800 bg-slate-900 p-6 shadow-2xl">
              <h2 className="mb-6 text-lg font-bold text-white">{selectedSupplier ? "Edit Supplier" : "New Supplier"}</h2>
              <SupplierForm supplier={selectedSupplier} onSuccess={fetchSuppliers} onClose={() => setOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Suppliers;
