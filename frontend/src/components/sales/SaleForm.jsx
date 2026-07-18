import React, { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import toast from "react-hot-toast";
import { createSale } from "../../services/saleService";
import { getProducts } from "../../services/productService";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Select from "../ui/Select";

const SaleForm = ({ onSuccess, onClose }) => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, control, setValue, watch, formState: { errors } } = useForm({
    defaultValues: {
      customerName: "",
      customerPhone: "",
      product: "",
      quantity: 1,
      sellingPrice: 0,
      paymentMethod: "Cash"
    }
  });

  const watchedQty = useWatch({ control, name: "quantity", defaultValue: 1 });
  const watchedPrice = useWatch({ control, name: "sellingPrice", defaultValue: 0 });
  const watchedProdId = watch("product");
  const [total, setTotal] = useState(0);

  // Load products list
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

  // Set prices and max quantity when product changes
  useEffect(() => {
    if (watchedProdId && products.length > 0) {
      const prod = products.find((p) => p._id === watchedProdId);
      if (prod) {
        setSelectedProduct(prod);
        setValue("sellingPrice", prod.sellingPrice);
      }
    } else {
      setSelectedProduct(null);
      setValue("sellingPrice", 0);
    }
  }, [watchedProdId, products, setValue]);

  // Calculate total amount in real-time
  useEffect(() => {
    const qty = Number(watchedQty) || 0;
    const price = Number(watchedPrice) || 0;
    setTotal(qty * price);
  }, [watchedQty, watchedPrice]);

  const onSubmit = async (data) => {
    // Validate quantity doesn't exceed stock limit
    if (selectedProduct && Number(data.quantity) > selectedProduct.quantity) {
      toast.error(`Insufficient stock! Only ${selectedProduct.quantity} units available.`);
      return;
    }

    setLoading(true);
    try {
      await createSale({
        ...data,
        quantity: Number(data.quantity),
        sellingPrice: Number(data.sellingPrice)
      });
      toast.success("Sale transaction completed successfully!");
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to log sale");
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
        <label className="mb-1.5 block text-sm font-medium text-slate-300">Select Medicine</label>
        {loadingProducts ? (
          <p className="text-xs text-slate-500">Loading products...</p>
        ) : (
          <Select
            options={productOptions}
            placeholder="Select product from inventory"
            {...register("product", { required: "Medicine selection is required" })}
          />
        )}
        {errors.product && <p className="mt-1 text-xs text-rose-500">{errors.product.message}</p>}
      </div>

      {selectedProduct && (
        <div className="bg-slate-900/40 border border-slate-800 p-3.5 rounded-xl text-xs space-y-1">
          <div className="text-slate-400">Available Quantity: <span className="text-white font-semibold">{selectedProduct.quantity} units</span></div>
          <div className="text-slate-400">Expiry Date: <span className="text-white">{new Date(selectedProduct.expiryDate).toLocaleDateString("en-IN")}</span></div>
          {selectedProduct.quantity <= selectedProduct.minimumStock && (
            <div className="text-amber-400 font-medium">⚠️ Low stock alert for this product!</div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-300">Quantity Sold</label>
          <Input
            type="number"
            placeholder="e.g. 5"
            {...register("quantity", { 
              required: "Quantity is required",
              min: { value: 1, message: "Must be at least 1" },
              validate: (val) => {
                if (selectedProduct && Number(val) > selectedProduct.quantity) {
                  return `Max stock is ${selectedProduct.quantity}`;
                }
                return true;
              }
            })}
          />
          {errors.quantity && <p className="mt-1 text-xs text-rose-500">{errors.quantity.message}</p>}
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-300">Selling Price (₹/unit)</label>
          <Input
            type="number"
            step="0.01"
            placeholder="Price per unit"
            {...register("sellingPrice", { 
              required: "Selling price is required",
              min: { value: 0.01, message: "Must be > 0" }
            })}
          />
          {errors.sellingPrice && <p className="mt-1 text-xs text-rose-500">{errors.sellingPrice.message}</p>}
        </div>
      </div>

      {/* Auto total display */}
      <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
        <span className="text-sm text-slate-400">Total Bill Amount:</span>
        <span className="text-xl font-bold text-emerald-400">₹{total.toLocaleString("en-IN")}</span>
      </div>

      {/* Customer Info */}
      <div className="border-t border-slate-800/80 pt-4 space-y-4">
        <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Customer Details</h3>
        
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-300">Customer Name</label>
          <Input
            placeholder="e.g. Walk-in Customer"
            {...register("customerName", { required: "Customer name is required" })}
          />
          {errors.customerName && <p className="mt-1 text-xs text-rose-500">{errors.customerName.message}</p>}
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-300">Customer Phone Number</label>
          <Input
            placeholder="Mobile number"
            {...register("customerPhone")}
          />
        </div>
      </div>

      {/* Payment Method */}
      <div className="border-t border-slate-800/80 pt-4">
        <label className="mb-1.5 block text-sm font-medium text-slate-300">Payment Method</label>
        <Select
          options={[
            { value: "Cash", label: "Cash" },
            { value: "UPI", label: "UPI / QR Scan" },
            { value: "Card", label: "Card Swipe" }
          ]}
          {...register("paymentMethod")}
        />
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
          {loading ? "Processing..." : "Generate Invoice"}
        </Button>
      </div>
    </form>
  );
};

export default SaleForm;
