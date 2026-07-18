import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Settings as SettingsIcon, Building2, Landmark, Mail, Phone, MapPin, Globe, Clock, Clock3, ShieldCheck, WalletCards } from "lucide-react";
import PageHeader from "../../components/ui/PageHeader";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import Loader from "../../components/ui/Loader";
import { getSettings, updateSettings } from "../../services/settingService";
import Card from "../../components/ui/Card";
import { useAuth } from "../../context/AuthContext";

const Settings = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await getSettings();
      const settings = res.data.data || {};
      reset({
        companyName: settings.companyName || "",
        gstNumber: settings.gstNumber || "",
        email: settings.email || "",
        phone: settings.phone || "",
        address: settings.address || "",
        currency: settings.currency || "INR",
        timezone: settings.timezone || "Asia/Kolkata"
      });
    } catch (err) {
      console.error(err);
      toast.error("Failed to load store configurations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const onSubmit = async (data) => {
    setSaving(true);
    try {
      await updateSettings(data);
      toast.success("ERP settings updated successfully!");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to update configurations");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-150px)] items-center justify-center bg-slate-950">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl">
      <PageHeader
        title="System Settings"
        subtitle="Manage the storefront identity, billing defaults, and regional configuration used across invoices and exports"
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card className="p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Signed in as</p>
              <p className="mt-2 text-sm font-semibold text-white">{user?.fullName || "Admin"}</p>
            </div>
            <ShieldCheck className="text-blue-400" size={20} />
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Billing currency</p>
              <p className="mt-2 text-sm font-semibold text-white">Configured in form</p>
            </div>
            <WalletCards className="text-emerald-400" size={20} />
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Timezone</p>
              <p className="mt-2 text-sm font-semibold text-white">Asia/Kolkata default</p>
            </div>
            <Clock3 className="text-amber-400" size={20} />
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Company profile</p>
              <p className="mt-2 text-sm font-semibold text-white">Brand data for invoices</p>
            </div>
            <Building2 className="text-purple-400" size={20} />
          </div>
        </Card>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8">
        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2 border-b border-slate-800 pb-4">
          <SettingsIcon size={20} className="text-blue-500" />
          <span>General Organization Details</span>
        </h3>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Company Name */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">Company Name</label>
              <Input
                icon={Building2}
                placeholder="e.g. Gloss Pharmaceuticals"
                {...register("companyName", { required: "Company name is required" })}
              />
              {errors.companyName && <p className="mt-1 text-xs text-rose-500">{errors.companyName.message}</p>}
            </div>

            {/* GST Number */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">Tax Identification Key / GSTIN</label>
              <Input
                icon={Landmark}
                placeholder="e.g. 24AAAAG1234A1Z1"
                {...register("gstNumber")}
              />
            </div>
            
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Contact Email */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">Contact Email</label>
              <Input
                icon={Mail}
                type="email"
                placeholder="e.g. bills@glosspharma.com"
                {...register("email", { required: "Billing email is required" })}
              />
              {errors.email && <p className="mt-1 text-xs text-rose-500">{errors.email.message}</p>}
            </div>

            {/* Contact Phone */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">Contact Phone Number</label>
              <Input
                icon={Phone}
                placeholder="e.g. +91 99999 99999"
                {...register("phone", { required: "Contact phone number is required" })}
              />
              {errors.phone && <p className="mt-1 text-xs text-rose-500">{errors.phone.message}</p>}
            </div>

          </div>

          {/* Address */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">Corporate Address</label>
            <Input
              icon={MapPin}
              placeholder="e.g. G-20, Corporate Chambers, Ahmedabad, Gujarat"
              {...register("address")}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-slate-800 pt-6">
            
            {/* Currency */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">Default Currency</label>
              <Select
                icon={Globe}
                options={[
                  { value: "INR", label: "Indian Rupee (₹)" },
                  { value: "USD", label: "US Dollar ($)" },
                  { value: "EUR", label: "Euro (€)" },
                  { value: "GBP", label: "British Pound (£)" }
                ]}
                {...register("currency")}
              />
            </div>

            {/* Timezone */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">Default Timezone</label>
              <Select
                icon={Clock}
                options={[
                  { value: "Asia/Kolkata", label: "India Standard Time (Asia/Kolkata)" },
                  { value: "UTC", label: "Coordinated Universal Time (UTC)" },
                  { value: "America/New_York", label: "Eastern Standard Time (EST)" }
                ]}
                {...register("timezone")}
              />
            </div>

          </div>

          <div className="flex justify-end gap-4 border-t border-slate-800 pt-6">
            <Button
              type="button"
              variant="secondary"
              onClick={fetchSettings}
              disabled={saving}
              className="w-auto px-6 py-2.5 text-sm"
            >
              Reset Changes
            </Button>
            <Button
              type="submit"
              disabled={saving}
              className="w-auto px-6 py-2.5 text-sm"
            >
              {saving ? "Updating..." : "Save ERP Settings"}
            </Button>
          </div>
        </form>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <Card>
          <h4 className="text-lg font-bold text-white">Preview panel</h4>
          <p className="mt-2 text-sm text-slate-400">
            These values feed invoice branding, email headers, and the backend report exports.
          </p>
          <div className="mt-6 space-y-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Company</p>
              <p className="mt-2 text-base font-semibold text-white">Gloss Pharmaceuticals</p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Invoice identity</p>
              <p className="mt-2 text-sm text-slate-300">Company name, GSTIN, phone, address, currency, and timezone all remain editable here.</p>
            </div>
          </div>
        </Card>

        <Card>
          <h4 className="text-lg font-bold text-white">Notes</h4>
          <ul className="mt-4 space-y-3 text-sm text-slate-400">
            <li>Only admin users can access and update this module.</li>
            <li>Changes apply to invoice export and company contact details.</li>
            <li>The backend stores a single active settings record.</li>
          </ul>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
