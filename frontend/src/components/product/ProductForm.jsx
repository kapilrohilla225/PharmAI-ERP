import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { createProduct, updateProduct } from "../../services/productService";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Select from "../ui/Select";
import { getCategoryOptions } from "../../constants/categories";

const ProductForm = ({ product, onSuccess, onClose }) => {
  const isEdit = !!product;
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  // Dynamic categories from the shared constants (includes newly created ones)
  const categories = getCategoryOptions();

  useEffect(() => {
    if (product) {
      reset({
        productName: product.productName || "",
        category: product.category || categories[0]?.value || "Tablet",
        manufacturer: product.manufacturer || "",
        batchNo: product.batchNo || "",
        quantity: product.quantity || 0,
        purchasePrice: product.purchasePrice || 0,
        sellingPrice: product.sellingPrice || 0,
        minimumStock: product.minimumStock || 10,
        expiryDate: product.expiryDate ? new Date(product.expiryDate).toISOString().split("T")[0] : "",
      });
    } else {
      reset({
        productName: "",
        category: categories[0]?.value || "Tablet",
        manufacturer: "",
        batchNo: "",
        quantity: 0,
        purchasePrice: 0,
        sellingPrice: 0,
        minimumStock: 10,
        expiryDate: "",
      });
    }
  }, [product, reset]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      if (isEdit) {
        await updateProduct(product._id, data);
        toast.success("Product updated successfully");
      } else {
        await createProduct(data);
        toast.success("Product created successfully");
      }
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to save product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 pb-8">
      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-300">Product Name</label>
        <Input
          placeholder="e.g. Paracetamol 500mg"
          {...register("productName", { required: "Product name is required" })}
        />
        {errors.productName && <p className="mt-1 text-xs text-rose-500">{errors.productName.message}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-300">Category</label>
          <Select
            options={categories}
            {...register("category", { required: "Category is required" })}
          />
          <p className="mt-1 text-[11px] text-slate-500">
            Don't see your category? Use "New Category" button on the inventory page.
          </p>
          {errors.category && <p className="mt-1 text-xs text-rose-500">{errors.category.message}</p>}
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-300">Manufacturer</label>
          <Input
            placeholder="e.g. Sun Pharma"
            {...register("manufacturer", { required: "Manufacturer is required" })}
          />
          {errors.manufacturer && <p className="mt-1 text-xs text-rose-500">{errors.manufacturer.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-300">Batch Number</label>
          <Input
            placeholder="e.g. BAT1029"
            {...register("batchNo", { required: "Batch number is required" })}
          />
          {errors.batchNo && <p className="mt-1 text-xs text-rose-500">{errors.batchNo.message}</p>}
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-300">Expiry Date</label>
          <Input
            type="date"
            {...register("expiryDate", { required: "Expiry date is required" })}
          />
          {errors.expiryDate && <p className="mt-1 text-xs text-rose-500">{errors.expiryDate.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-300">Purchase Price (₹)</label>
          <Input
            type="number"
            step="0.01"
            placeholder="Cost price"
            {...register("purchasePrice", {
              required: "Required",
              valueAsNumber: true,
              min: { value: 0.01, message: "Must be > 0" },
            })}
          />
          {errors.purchasePrice && <p className="mt-1 text-xs text-rose-500">{errors.purchasePrice.message}</p>}
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-300">Selling Price (₹)</label>
          <Input
            type="number"
            step="0.01"
            placeholder="Sale price"
            {...register("sellingPrice", {
              required: "Required",
              valueAsNumber: true,
              min: { value: 0.01, message: "Must be > 0" },
            })}
          />
          {errors.sellingPrice && <p className="mt-1 text-xs text-rose-500">{errors.sellingPrice.message}</p>}
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-300">Min. Stock Alert</label>
          <Input
            type="number"
            placeholder="Alert threshold"
            {...register("minimumStock", {
              required: "Required",
              valueAsNumber: true,
              min: { value: 0, message: "Must be >= 0" },
            })}
          />
          {errors.minimumStock && <p className="mt-1 text-xs text-rose-500">{errors.minimumStock.message}</p>}
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-300">Quantity In Stock</label>
        <Input
          type="number"
          placeholder="Available quantity"
          disabled={isEdit}
          {...register("quantity", {
            required: "Quantity is required",
            valueAsNumber: true,
            min: { value: 0, message: "Must be >= 0" },
          })}
        />
        {errors.quantity && <p className="mt-1 text-xs text-rose-500">{errors.quantity.message}</p>}
        {isEdit && (
          <p className="mt-1 text-[11px] text-slate-400">
            * Note: To adjust quantity, register a new Purchase or Sale transaction.
          </p>
        )}
      </div>

      <div className="flex gap-4 pt-3">
        <Button type="button" variant="secondary" onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : isEdit ? "Update Product" : "Create Product"}
        </Button>
      </div>
    </form>
  );
};

export default ProductForm;
