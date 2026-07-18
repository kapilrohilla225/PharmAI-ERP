import React, { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import toast from "react-hot-toast";
import { createPurchase } from "../../services/purchaseService";
import { getProducts } from "../../services/productService";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Select from "../ui/Select";

const PurchaseForm = ({ onSuccess, onClose }) => {
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, control, setValue, formState: { errors } } = useForm({
    defaultValues: {
      supplierName: "",
      supplierEmail: "",
      supplierPhone: "",
      product: "",
      quantity: 0,
      purchasePrice: 0,
      paymentStatus: "Pending",
      purchaseDate: new Date().toISOString().split("T")[0]
    }
  });

  // Watch quantity and purchasePrice fields to auto-calculate the total
  const watchedQty = useWatch({ control, name: "quantity", defaultValue: 0 });
  const watchedPrice = useWatch({ control, name: "purchasePrice", defaultValue: 0 });
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const qty = Number(watchedQty) || 0;
    const price = Number(watchedPrice) || 0;
    setTotal(qty * price);
  }, [watchedQty, watchedPrice]);

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const res = await getProducts();
        setProducts(res.data.data || []);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load products list");
      } finally {
        setLoadingProducts(false);
      }
    };
    fetchAllProducts();
  }, []);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await createPurchase({
        ...data,
        quantity: Number(data.quantity),
        purchasePrice: Number(data.purchasePrice)
      });
      toast.success("Purchase transaction logged successfully");
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to log purchase");
    } finally {
      setLoading(false);
    }
  };

  const productOptions = products.map((p) => ({
    value: p._id,
    label: `${p.productName} (Code: ${p.productCode}, Stock: ${p.quantity})`
  }));

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 pb-8">
      {/* Product Selection */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-300">Select Medicine / Product</label>
        {loadingProducts ? (
          <p className="text-xs text-slate-500">Loading products...</p>
        ) : (
          <Select
            options={productOptions}
            placeholder="Select a product from inventory"
            {...register("product", { required: "Product selection is required" })}
          />
        )}
        {errors.product && <p className="mt-1 text-xs text-rose-500">{errors.product.message}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-300">Quantity Purchased</label>
          <Input
            type="number"
            placeholder="e.g. 100"
            {...register("quantity", { 
              required: "Quantity is required",
              min: { value: 1, message: "Must be at least 1" }
            })}
          />
          {errors.quantity && <p className="mt-1 text-xs text-rose-500">{errors.quantity.message}</p>}
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-300">Purchase Cost Price (₹/unit)</label>
          <Input
            type="number"
            step="0.01"
            placeholder="Price per unit"
            {...register("purchasePrice", { 
              required: "Cost price is required",
              min: { value: 0.01, message: "Must be > 0" }
            })}
          />
          {errors.purchasePrice && <p className="mt-1 text-xs text-rose-500">{errors.purchasePrice.message}</p>}
        </div>
      </div>

      {/* Auto total display */}
      <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
        <span className="text-sm text-slate-400">Total Purchase Amount:</span>
        <span className="text-xl font-bold text-emerald-400">₹{total.toLocaleString("en-IN")}</span>
      </div>

      {/* Supplier Section */}
      <div className="border-t border-slate-800/80 pt-4 space-y-4">
        <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Supplier Information</h3>
        
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-300">Supplier Name</label>
          <Input
            placeholder="e.g. Mankind Pharmaceuticals"
            {...register("supplierName", { required: "Supplier name is required" })}
          />
          {errors.supplierName && <p className="mt-1 text-xs text-rose-500">{errors.supplierName.message}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-300">Supplier Email</label>
            <Input
              type="email"
              placeholder="supplier@company.com"
              {...register("supplierEmail")}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-300">Supplier Phone</label>
            <Input
              placeholder="Contact number"
              {...register("supplierPhone")}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-800/80 pt-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-300">Payment Status</label>
          <Select
            options={[
              { value: "Pending", label: "Pending / Unpaid" },
              { value: "Partial", label: "Partial Payment"  },
              { value: "Paid",    label: "Paid"             }
            ]}
            {...register("paymentStatus")}
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-300">Purchase Date</label>
          <Input
            type="date"
            {...register("purchaseDate", { required: "Purchase date is required" })}
          />
          {errors.purchaseDate && <p className="mt-1 text-xs text-rose-500">{errors.purchaseDate.message}</p>}
        </div>
      </div>

      <div className="flex gap-4 pt-3">
        <Button
          type="button"
          variant="secondary"
          onClick={onClose}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={loading}
        >
          {loading ? "Logging..." : "Save Purchase Log"}
        </Button>
      </div>
    </form>
  );
};

export default PurchaseForm;
