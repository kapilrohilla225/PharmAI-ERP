import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { AnimatePresence, motion } from "framer-motion";
import PageHeader from "../../components/ui/PageHeader";
import Button from "../../components/ui/Button";
import SearchBox from "../../components/ui/SearchBox";
import Select from "../../components/ui/Select";
import Input from "../../components/ui/Input";
import Table from "../../components/ui/Table";
import Badge from "../../components/ui/Badge";
import Loader from "../../components/ui/Loader";
import Pagination from "../../components/ui/Pagination";
import ProductDrawer from "../../components/product/ProductDrawer";
import ProductForm from "../../components/product/ProductForm";
import { getProducts, deleteProduct } from "../../services/productService";
import { useAuth } from "../../context/AuthContext";
import { getPermissions } from "../../constants/access";
import { getCategoryFilterOptions, addCategory, UNIT_OPTIONS } from "../../constants/categories";
import Card from "../../components/ui/Card";
import { AlertTriangle, Boxes, ScanSearch, Wallet, Plus, FolderPlus, X } from "lucide-react";

// â”€â”€â”€ Create Category Modal â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const CreateCategoryModal = ({ open, onClose, onCreated }) => {
  const [name, setName] = useState("");
  const [unit, setUnit] = useState("Strip");
  const [description, setDescription] = useState("");

  const handleCreate = () => {
    if (!name.trim()) {
      toast.error("Category name is required");
      return;
    }
    const result = addCategory({
      name: name.trim(),
      unit,
      description: description.trim(),
    });
    if (result.success) {
      toast.success(`Category "${name}" created successfully`);
      setName("");
      setUnit("Strip");
      setDescription("");
      onCreated();
      onClose();
    } else {
      toast.error(result.message);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed left-1/2 top-1/2 z-[70] w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-slate-700 bg-slate-900 p-6 shadow-2xl shadow-black/50"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-400">
                  <FolderPlus size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Create New Category</h3>
                  <p className="text-xs text-slate-400">Add a new product category with unit type</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="rounded-xl bg-slate-800 p-2 text-slate-400 hover:bg-slate-700 hover:text-white transition cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-4">
              {/* Category Name */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-300">Category Name *</label>
                <Input
                  placeholder="e.g. Suppository, Patch, Spray..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              {/* Unit */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-300">Default Unit *</label>
                <Select
                  options={UNIT_OPTIONS}
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                />
                <p className="mt-1 text-[11px] text-slate-500">
                  Unit type used when measuring this category (e.g. Strip for tablets, Bottle for syrups)
                </p>
              </div>

              {/* Description */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-300">Description (optional)</label>
                <Input
                  placeholder="Brief description of this category"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={onClose}
                className="flex-1 rounded-xl border border-slate-700 bg-slate-800 py-2.5 text-sm font-semibold text-slate-300 transition hover:bg-slate-700 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                className="flex-1 rounded-xl bg-blue-600 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500 cursor-pointer"
              >
                Create Category
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// â”€â”€â”€ Main Products Page â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const Products = () => {
  const { user } = useAuth();
  const perms = getPermissions(user?.role, "products");

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [categoryKey, setCategoryKey] = useState(0); // force re-render on new category

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await getProducts();
      setProducts(res.data.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleAddClick = () => {
    setSelectedProduct(null);
    setOpen(true);
  };

  const handleEditClick = (product) => {
    setSelectedProduct(product);
    setOpen(true);
  };

  const handleDeleteClick = async (product) => {
    if (user?.role !== "admin") {
      toast.error("Only administrators can delete product records");
      return;
    }

    const result = await Swal.fire({
      title: "Are you sure?",
      text: `You are about to delete ${product.productName}. This will clear its record from active stock!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      background: "#1e293b",
      color: "#ffffff",
      allowOutsideClick: true,
    });

    if (result.isConfirmed) {
      try {
        await deleteProduct(product._id);
        toast.success("Product deleted successfully");
        fetchProducts();
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to delete product");
      }
    }
  };

  const filteredProducts = products.filter((p) => {
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      p.productName?.toLowerCase().includes(q) ||
      p.productCode?.toLowerCase().includes(q) ||
      p.manufacturer?.toLowerCase().includes(q);
    const matchesCategory = selectedCategory === "" || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const totalPages       = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex       = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  const categories = getCategoryFilterOptions();

  const getStockStatus = (p) => {
    if (p.quantity === 0) return { label: "Out of Stock", variant: "danger" };
    if (p.quantity <= p.minimumStock) return { label: "Low Stock", variant: "warning" };
    return { label: "In Stock", variant: "success" };
  };

  const isExpired = (expiryDate) => new Date(expiryDate) < new Date();

  const totalStockValue = products.reduce((sum, p) => sum + (p.quantity * p.purchasePrice), 0);
  const lowStockCount   = filteredProducts.filter((p) => p.quantity <= p.minimumStock).length;
  const expiredCount    = filteredProducts.filter((p) => isExpired(p.expiryDate)).length;
  const inventoryValue  = filteredProducts.reduce((sum, p) => sum + (p.quantity * p.purchasePrice), 0);

  return (
    <>
      <div className="space-y-6">
        <PageHeader
          title="Inventory Control Center"
          subtitle="Monitor product batches, pricing, expiry timelines, and live stock value from one screen"
        >
          <div className="flex items-center gap-3">
            {perms.canWrite && (
              <>
                <button
                  onClick={() => setCategoryModalOpen(true)}
                  className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm font-semibold text-slate-300 transition hover:bg-slate-700 hover:text-white cursor-pointer"
                >
                  <FolderPlus size={16} />
                  New Category
                </button>
                <Button className="w-auto px-6 py-2.5 text-sm" onClick={handleAddClick}>
                  <span className="flex items-center gap-1.5">
                    <Plus size={16} />
                    Create Product
                  </span>
                </Button>
              </>
            )}
          </div>
        </PageHeader>

        {/* KPI Cards */}
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Card className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Inventory items</p>
                <p className="mt-2 text-2xl font-bold text-white">{filteredProducts.length}</p>
              </div>
              <Boxes className="text-blue-400" size={22} />
            </div>
          </Card>
          <Card className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Low stock</p>
                <p className="mt-2 text-2xl font-bold text-white">{lowStockCount}</p>
              </div>
              <AlertTriangle className="text-amber-400" size={22} />
            </div>
          </Card>
          <Card className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Expired batches</p>
                <p className="mt-2 text-2xl font-bold text-white">{expiredCount}</p>
              </div>
              <ScanSearch className="text-rose-400" size={22} />
            </div>
          </Card>
          <Card className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Stock value</p>
                <p className="mt-2 text-2xl font-bold text-white">₹{totalStockValue.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
              </div>
              <Wallet className="text-emerald-400" size={22} />
            </div>
          </Card>
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between bg-slate-900/50 p-4 rounded-2xl border border-slate-800/80 backdrop-blur-md">
          <div className="flex flex-col md:flex-row gap-4 flex-1">
            <SearchBox
              placeholder="Search name, code, manufacturer..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            />
            <div className="w-full md:w-56" key={categoryKey}>
              <Select
                options={categories}
                value={selectedCategory}
                onChange={(e) => { setSelectedCategory(e.target.value); setCurrentPage(1); }}
              />
            </div>
          </div>
          <div className="text-sm text-slate-400">
            Filtered Items: <span className="font-semibold text-white">{filteredProducts.length}</span>
          </div>
        </div>

        {/* Table View */}
        <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/30">
          <Table
            columns={[
              "Product Code",
              "Product Name",
              "Category / Maker",
              "Expiry Date",
              "Prices (Cost / Sale)",
              "Stock Status",
              "Stock Qty",
              ...(perms.canWrite ? ["Actions"] : []),
            ]}
          >
            {loading ? (
              <tr><td colSpan={8} className="py-8 text-center text-slate-400"><Loader size="md" /></td></tr>
            ) : paginatedProducts.length === 0 ? (
              <tr><td colSpan={8} className="py-8 text-center text-slate-400">No Products Found</td></tr>
            ) : (
              paginatedProducts.map((p) => {
                const stockStatus = getStockStatus(p);
                const expired = isExpired(p.expiryDate);
                return (
                  <tr key={p._id} className="border-t border-slate-800/60 hover:bg-slate-800/25 transition duration-150">
                    <td className="px-6 py-4 font-semibold text-blue-400 text-sm">{p.productCode}</td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-white">{p.productName}</div>
                      <div className="text-xs text-slate-400 font-medium">Batch: <span className="text-slate-300">{p.batchNo}</span></div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="text-slate-200">{p.category}</div>
                      <div className="text-xs text-slate-400">{p.manufacturer}</div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className={expired ? "text-red-400 font-medium" : "text-slate-300"}>
                        {p.expiryDate ? new Date(p.expiryDate).toLocaleDateString("en-IN") : "-"}
                      </span>
                      {expired && (
                        <span className="block text-[10px] text-red-500 font-bold uppercase tracking-wider">Expired</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="text-slate-400">Cost: <span className="text-white">₹{Number(p.purchasePrice).toFixed(2)}</span></div>
                      <div className="text-slate-400">Sale: <span className="text-emerald-400 font-medium">₹{Number(p.sellingPrice).toFixed(2)}</span></div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={stockStatus.variant}>{stockStatus.label}</Badge>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-white">
                      {p.quantity} <span className="text-xs font-normal text-slate-400">units</span>
                    </td>
                    {perms.canWrite && (
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditClick(p)}
                            className="rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 px-3 py-1.5 text-xs text-white transition font-medium"
                          >
                            Edit
                          </button>
                          {user?.role === "admin" && (
                            <button
                              onClick={() => handleDeleteClick(p)}
                              className="rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 px-3 py-1.5 text-xs text-red-400 transition font-medium"
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })
            )}
          </Table>
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>

      {perms.canWrite && (
        <ProductDrawer
          open={open}
          onClose={() => setOpen(false)}
          title={selectedProduct ? "Update Product Details" : "Create New Product"}
        >
          <ProductForm
            key={categoryKey}
            product={selectedProduct}
            onSuccess={fetchProducts}
            onClose={() => setOpen(false)}
          />
        </ProductDrawer>
      )}

      {/* Create Category Modal */}
      <CreateCategoryModal
        open={categoryModalOpen}
        onClose={() => setCategoryModalOpen(false)}
        onCreated={() => setCategoryKey((k) => k + 1)}
      />
    </>
  );
};

export default Products;
