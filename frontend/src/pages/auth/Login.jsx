import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Lock, Mail, KeyRound, ArrowLeft, UserCircle2 } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";

const API_BASE = import.meta.env.VITE_API_URL?.replace("/api/v1", "") || "http://localhost:5000";

// ==========================================
// Independent Form Components (Defined Outside)
// ==========================================

const LoginForm = ({ login, setMode, loading, setLoading, navigate }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  
  const handleLoginSubmit = async (data) => {
    setLoading(true);
    const res = await login(data.email, data.password);
    if (res.success) {
      toast.success("Welcome back to Gloss Pharma ERP!");
      navigate("/dashboard");
    } else {
      toast.error(res.message);
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit(handleLoginSubmit)} className="space-y-4">
      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-300">Email Address</label>
        <Input
          icon={Mail}
          type="email"
          placeholder="name@company.com"
          {...register("email", {
            required: "Email address is required",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Invalid email address"
            }
          })}
        />
        {errors.email && <p className="mt-1 text-xs text-rose-500">{errors.email.message}</p>}
      </div>

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-sm font-medium text-slate-300">Password</label>
          <button
            type="button"
            onClick={() => setMode("forgot")}
            className="text-xs text-blue-400 hover:text-blue-300 hover:underline transition cursor-pointer"
          >
            Forgot password?
          </button>
        </div>
        <Input
          icon={Lock}
          type="password"
          placeholder="••••••••"
          {...register("password", {
            required: "Password is required",
            minLength: { value: 6, message: "Password must be at least 6 characters" }
          })}
        />
        {errors.password && <p className="mt-1 text-xs text-rose-500">{errors.password.message}</p>}
      </div>

      <div className="pt-2">
        <Button type="submit" disabled={loading}>
          {loading ? "Signing In..." : "Sign In"}
        </Button>
      </div>

      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-700" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-slate-900 px-2 text-slate-500">or continue with</span>
        </div>
      </div>

      <a
        href={`${API_BASE}/api/v1/auth/google`}
        className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-700 bg-slate-800/50 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-700/50 hover:border-slate-600"
      >
        <svg className="h-5 w-5" viewBox="0 0 24 24">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
        </svg>
        Sign in with Google
      </a>
    </form>
  );
};

const ForgotForm = ({ forgotPassword, setEmail, setMode, loading, setLoading }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const handleForgotSubmit = async (data) => {
    setLoading(true);
    const res = await forgotPassword(data.email);
    if (res.success) {
      toast.success(res.message || "OTP sent to your email!");
      setEmail(data.email);
      setMode("otp");
    } else {
      toast.error(res.message);
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit(handleForgotSubmit)} className="space-y-4">
      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-300">Email Address</label>
        <Input
          icon={Mail}
          type="email"
          placeholder="name@company.com"
          {...register("email", {
            required: "Email address is required",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Invalid email address"
            }
          })}
        />
        {errors.email && <p className="mt-1 text-xs text-rose-500">{errors.email.message}</p>}
      </div>

      <div className="pt-2">
        <Button type="submit" disabled={loading}>
          {loading ? "Sending..." : "Send Verification Link"}
        </Button>
      </div>
    </form>
  );
};

const OtpForm = ({ verifyOtp, email, setOtp, setMode, loading, setLoading }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const handleOtpSubmit = async (data) => {
    setLoading(true);
    const res = await verifyOtp(email, data.otp);
    if (res.success) {
      toast.success("OTP verified! Create your new password.");
      setOtp(data.otp);
      setMode("reset");
    } else {
      toast.error(res.message);
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit(handleOtpSubmit)} className="space-y-4">
      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-300">Verification OTP</label>
        <Input
          icon={KeyRound}
          type="text"
          placeholder="Enter 6-digit OTP"
          {...register("otp", {
            required: "OTP is required",
            minLength: { value: 4, message: "OTP is too short" }
          })}
        />
        {errors.otp && <p className="mt-1 text-xs text-rose-500">{errors.otp.message}</p>}
      </div>

      <div className="pt-2">
        <Button type="submit" disabled={loading}>
          {loading ? "Verifying..." : "Verify & Proceed"}
        </Button>
      </div>
    </form>
  );
};

const ResetForm = ({ resetPassword, email, otp, setMode, loading, setLoading }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const handleResetSubmit = async (data) => {
    setLoading(true);
    const res = await resetPassword(email, otp, data.newPassword);
    if (res.success) {
      toast.success("Password reset successful! Please log in.");
      setMode("login");
    } else {
      toast.error(res.message);
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit(handleResetSubmit)} className="space-y-4">
      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-300">New Password</label>
        <Input
          icon={Lock}
          type="password"
          placeholder="Min 6 characters"
          {...register("newPassword", {
            required: "New password is required",
            minLength: { value: 6, message: "Password must be at least 6 characters" }
          })}
        />
        {errors.newPassword && <p className="mt-1 text-xs text-rose-500">{errors.newPassword.message}</p>}
      </div>

      <div className="pt-2">
        <Button type="submit" disabled={loading}>
          {loading ? "Resetting..." : "Update Password"}
        </Button>
      </div>
    </form>
  );
};

// ==========================================
// Demo Section (for non-signup exploration)
// ==========================================

const DemoSection = () => {
  return (
    <div className="mt-6 pt-4 border-t border-slate-700/50">
      <p className="text-[10px] uppercase tracking-[0.12em] font-semibold text-slate-500 mb-2.5 text-center">
        Explore Without Signing Up
      </p>
      <div className="grid grid-cols-3 gap-2.5">
        {[
          { role: "admin", label: "Admin", desc: "Full access", gradient: "from-blue-600/10 to-blue-900/5 border-blue-500/20 hover:border-blue-400/40" },
          { role: "hr", label: "HR", desc: "Employees & more", gradient: "from-amber-600/10 to-amber-900/5 border-amber-500/20 hover:border-amber-400/40" },
          { role: "employee", label: "Employee", desc: "Basic view", gradient: "from-emerald-600/10 to-emerald-900/5 border-emerald-500/20 hover:border-emerald-400/40" },
        ].map(({ role, label, desc, gradient }) => (
          <a
            key={role}
            href={`/?demo=${role}`}
            className={`group flex flex-col items-center gap-1 rounded-xl border bg-gradient-to-br ${gradient} px-3 py-2.5 text-center transition hover:scale-[1.03] active:scale-[0.97]`}
          >
            <span className="text-xs font-bold text-white group-hover:text-blue-300">{label}</span>
            <span className="text-[10px] text-slate-500 leading-tight">{desc}</span>
          </a>
        ))}
      </div>
    </div>
  );
};

// ==========================================
// Main Login Page Component
// ==========================================

const Login = () => {
  const navigate = useNavigate();
  const { login, forgotPassword, verifyOtp, resetPassword, isAuthenticated } = useAuth();
  
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-6 py-12">
      <div className="grid w-full max-w-5xl grid-cols-1 overflow-hidden rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl lg:grid-cols-2">
        
        {/* Left Side: Brand presentation */}
        <div className="hidden bg-linear-to-br from-blue-600 via-indigo-800 to-slate-950 p-12 text-white lg:flex lg:flex-col lg:justify-between relative">
          <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
          
          <div>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-md">
                <span className="text-xl font-bold text-blue-400">G</span>
              </div>
              <h1 className="text-2xl font-bold tracking-tight">Gloss Pharma</h1>
            </div>
            <p className="mt-8 text-slate-200 text-lg leading-relaxed">
              Enterprise Resource Planning software designed for pharmaceutical inventory, sales tracking, HR management, and AI-powered business analytics.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 bg-white/5 rounded-2xl p-3 border border-white/10 backdrop-blur-md">
              <div className="h-3 w-3 rounded-full bg-emerald-400"></div>
              <span className="text-sm font-medium">Real-time Stock Management</span>
            </div>
            <div className="flex items-center gap-3 bg-white/5 rounded-2xl p-3 border border-white/10 backdrop-blur-md">
              <div className="h-3 w-3 rounded-full bg-blue-400"></div>
              <span className="text-sm font-medium">Auto Invoice & Excel Exports</span>
            </div>
            <div className="flex items-center gap-3 bg-white/5 rounded-2xl p-3 border border-white/10 backdrop-blur-md">
              <div className="h-3 w-3 rounded-full bg-indigo-400"></div>
              <span className="text-sm font-medium">Gemini AI Prescriptions & Insights</span>
            </div>
          </div>
        </div>

        {/* Right Side: Interactive Forms */}
        <div className="p-8 md:p-14 flex flex-col justify-center">
          
          {/* Back button for secondary modes */}
          {mode !== "login" && (
            <button
              onClick={() => {
                if (mode === "otp") setMode("forgot");
                else if (mode === "reset") setMode("otp");
                else setMode("login");
              }}
              className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 text-sm transition mr-auto cursor-pointer"
            >
              <ArrowLeft size={16} />
              <span>Back</span>
            </button>
          )}

          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            {mode === "login" && "Welcome Back"}
            {mode === "forgot" && "Reset Password"}
            {mode === "otp" && "Verify OTP"}
            {mode === "reset" && "Set New Password"}
          </h2>
          
          <p className="mt-2 text-slate-400 text-sm mb-6">
            {mode === "login" && "Sign in to access your administrative workspace."}
            {mode === "forgot" && "Enter your email address to receive a verification OTP."}
            {mode === "otp" && `We've sent a code to your inbox: ${email}`}
            {mode === "reset" && "Choose a strong password containing at least 6 characters."}
          </p>

          {/* Form rendering */}
          {mode === "login" && (
            <>
              <LoginForm
                login={login}
                setMode={setMode}
                loading={loading}
                setLoading={setLoading}
                navigate={navigate}
              />
              <DemoSection />
            </>
          )}
          {mode === "forgot" && (
            <ForgotForm
              forgotPassword={forgotPassword}
              setEmail={setEmail}
              setMode={setMode}
              loading={loading}
              setLoading={setLoading}
            />
          )}
          {mode === "otp" && (
            <OtpForm
              verifyOtp={verifyOtp}
              email={email}
              setOtp={setOtp}
              setMode={setMode}
              loading={loading}
              setLoading={setLoading}
            />
          )}
          {mode === "reset" && (
            <ResetForm
              resetPassword={resetPassword}
              email={email}
              otp={otp}
              setMode={setMode}
              loading={loading}
              setLoading={setLoading}
            />
          )}

        </div>
      </div>
    </div>
  );
};

export default Login;