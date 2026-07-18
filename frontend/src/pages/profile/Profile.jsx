import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { User, Mail, Phone, ShieldCheck, KeyRound, Upload, Trash2, CheckCircle2 } from "lucide-react";
import PageHeader from "../../components/ui/PageHeader";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Card from "../../components/ui/Card";
import { useAuth } from "../../context/AuthContext";
import { getRoleLabel } from "../../constants/access";

const Profile = () => {
  const { user, roleLabel, updateProfile, changePassword } = useAuth();
  
  // Profile update state
  const [savingProfile, setSavingProfile] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || null);
  const [avatarFile, setAvatarFile] = useState(null);
  
  // Password change state
  const [savingPassword, setSavingPassword] = useState(false);

  const { register: registerProfile, handleSubmit: handleProfileSubmit, reset: resetProfile, formState: { errors: profileErrors } } = useForm();
  const { register: registerPassword, handleSubmit: handlePasswordSubmit, reset: resetPasswordForm, formState: { errors: passwordErrors }, watch: watchPassword } = useForm();

  useEffect(() => {
    if (user) {
      resetProfile({
        fullName: user.fullName || "",
        phone: user.phone || ""
      });
      setAvatarPreview(user.avatar || null);
    }
  }, [user, resetProfile]);

  const onAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size must be less than 5MB");
        return;
      }
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const removeAvatar = async () => {
    if (!user.avatar) {
      setAvatarFile(null);
      setAvatarPreview(null);
      return;
    }
    
    setSavingProfile(true);
    const formData = new FormData();
    formData.append("removeAvatar", "true");
    
    const res = await updateProfile(formData);
    if (res.success) {
      toast.success("Profile photo removed");
      setAvatarFile(null);
      setAvatarPreview(null);
    } else {
      toast.error(res.message);
    }
    setSavingProfile(false);
  };

  const onProfileSubmit = async (data) => {
    if (user?.isDefaultAdmin) {
      toast.error("Default Admin details are locked.");
      return;
    }

    setSavingProfile(true);
    const formData = new FormData();
    if (data.fullName !== user.fullName) formData.append("fullName", data.fullName);
    if (data.phone !== user.phone) formData.append("phone", data.phone);
    if (avatarFile) formData.append("avatar", avatarFile);

    const res = await updateProfile(formData);
    if (res.success) {
      toast.success(res.message);
      setAvatarFile(null);
    } else {
      toast.error(res.message);
    }
    setSavingProfile(false);
  };

  const onPasswordSubmit = async (data) => {
    setSavingPassword(true);
    const res = await changePassword(data.oldPassword, data.newPassword);
    if (res.success) {
      toast.success(res.message);
      resetPasswordForm();
    } else {
      toast.error(res.message);
    }
    setSavingPassword(false);
  };

  const newPasswordVal = watchPassword("newPassword");

  return (
    <div className="space-y-6 max-w-5xl">
      <PageHeader
        title="My Profile"
        subtitle="Manage your personal information, profile photo, and security credentials"
      />

      <div className="grid grid-cols-1 xl:grid-cols-[350px_1fr] gap-6">
        
        {/* Left Column: Avatar & Summary */}
        <div className="space-y-6">
          <Card className="flex flex-col items-center text-center p-8">
            <div className="relative mb-6">
              <div className="h-32 w-32 rounded-full overflow-hidden border-4 border-slate-800 bg-slate-900 flex items-center justify-center relative group">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Profile" className="h-full w-full object-cover" />
                ) : (
                  <User size={48} className="text-slate-600" />
                )}
                
                {/* Upload Overlay */}
                <label className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <Upload size={20} className="text-white mb-1" />
                  <span className="text-[10px] font-semibold text-white uppercase tracking-wider">Upload</span>
                  <input type="file" className="hidden" accept="image/png, image/jpeg" onChange={onAvatarChange} />
                </label>
              </div>
              
              {avatarPreview && (
                <button
                  type="button"
                  onClick={removeAvatar}
                  className="absolute bottom-0 right-0 p-2 bg-rose-500 rounded-full text-white shadow-lg hover:bg-rose-600 transition"
                  title="Remove Photo"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>

            <h3 className="text-xl font-bold text-white mb-1">{user?.fullName}</h3>
            <p className="text-sm font-semibold text-blue-400 capitalize mb-4">{roleLabel || getRoleLabel(user?.role)}</p>
            
            {user?.isDefaultAdmin && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-6">
                <ShieldCheck size={14} />
                <span>Super Administrator</span>
              </div>
            )}
            
            <div className="w-full space-y-3 mt-2 text-left">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/50 border border-slate-800/80">
                <div className="p-2 rounded-lg bg-slate-800 text-slate-400 shrink-0"><Mail size={16} /></div>
                <div className="min-w-0">
                  <p className="text-[10px] uppercase font-bold text-slate-500">Email Address</p>
                  <p className="text-sm text-slate-300 truncate">{user?.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/50 border border-slate-800/80">
                <div className="p-2 rounded-lg bg-slate-800 text-slate-400 shrink-0"><Phone size={16} /></div>
                <div className="min-w-0">
                  <p className="text-[10px] uppercase font-bold text-slate-500">Phone</p>
                  <p className="text-sm text-slate-300 truncate">{user?.phone || "Not provided"}</p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Forms */}
        <div className="space-y-6">
          
          {/* Profile Details Form */}
          <Card>
            <div className="flex items-center justify-between mb-6 border-b border-slate-800 pb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <User size={20} className="text-blue-500" />
                Personal Details
              </h3>
              {user?.isDefaultAdmin && (
                <span className="text-xs font-semibold text-rose-400 flex items-center gap-1.5 bg-rose-500/10 px-2.5 py-1 rounded-md border border-rose-500/20">
                  <ShieldCheck size={14} /> Locked Profile
                </span>
              )}
            </div>

            <form onSubmit={handleProfileSubmit(onProfileSubmit)} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-300">Full Name</label>
                  <Input
                    icon={User}
                    placeholder="Enter your full name"
                    disabled={user?.isDefaultAdmin}
                    {...registerProfile("fullName", { required: "Name is required" })}
                  />
                  {profileErrors.fullName && <p className="mt-1 text-xs text-rose-500">{profileErrors.fullName.message}</p>}
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-300">Phone Number</label>
                  <Input
                    icon={Phone}
                    placeholder="Enter your phone number"
                    disabled={user?.isDefaultAdmin}
                    {...registerProfile("phone")}
                  />
                </div>
              </div>
              
              <div className="flex justify-end pt-4 border-t border-slate-800">
                <Button 
                  type="submit" 
                  disabled={savingProfile || (user?.isDefaultAdmin && !avatarFile && !avatarPreview)}
                  className="w-auto px-6"
                >
                  {savingProfile ? "Saving..." : "Save Profile Changes"}
                </Button>
              </div>
            </form>
          </Card>

          {/* Change Password Form */}
          <Card>
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2 border-b border-slate-800 pb-4">
              <KeyRound size={20} className="text-emerald-500" />
              Security & Password
            </h3>

            <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="space-y-5">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-300">Current Password</label>
                <Input
                  type="password"
                  placeholder="Enter current password"
                  {...registerPassword("oldPassword", { required: "Current password is required" })}
                />
                {passwordErrors.oldPassword && <p className="mt-1 text-xs text-rose-500">{passwordErrors.oldPassword.message}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-300">New Password</label>
                  <Input
                    type="password"
                    placeholder="Enter new password"
                    {...registerPassword("newPassword", { 
                      required: "New password is required",
                      minLength: { value: 6, message: "Password must be at least 6 characters" }
                    })}
                  />
                  {passwordErrors.newPassword && <p className="mt-1 text-xs text-rose-500">{passwordErrors.newPassword.message}</p>}
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-300">Confirm New Password</label>
                  <Input
                    type="password"
                    placeholder="Confirm new password"
                    {...registerPassword("confirmPassword", { 
                      required: "Please confirm your password",
                      validate: value => value === newPasswordVal || "Passwords do not match"
                    })}
                  />
                  {passwordErrors.confirmPassword && <p className="mt-1 text-xs text-rose-500">{passwordErrors.confirmPassword.message}</p>}
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-slate-800">
                <Button type="submit" disabled={savingPassword} className="w-auto px-6 bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20">
                  {savingPassword ? "Updating..." : "Update Password"}
                </Button>
              </div>
            </form>
          </Card>
          
        </div>
      </div>
    </div>
  );
};

export default Profile;
