import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "../api/axios";
import { canAccessModule, getAccessibleModules, getDefaultRouteForRole, getRoleLabel } from "../constants/access";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [demoMode, setDemoMode] = useState(false);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (token) {
        const res = await axios.get("/auth/me");
        if (res.data && res.data.success) {
          setUser(res.data.user);
        } else {
          doLogout();
        }
      }
    } catch (err) {
      console.error("Error fetching user profile:", err);
      doLogout();
    } finally {
      setLoading(false);
    }
  };

  const doDemoLogin = async (role) => {
    try {
      const res = await axios.post("/auth/demo-login", { role });
      if (res.data?.success && res.data?.data) {
        const { accessToken, user: userData } = res.data.data;
        localStorage.setItem("accessToken", accessToken);
        setUser(userData);
        setDemoMode(true);
        return true;
      }
      return false;
    } catch {
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const demoRole = params.get("demo");

    if (demoRole && ["admin", "hr", "employee"].includes(demoRole)) {
      window.history.replaceState({}, "", window.location.pathname);
      doDemoLogin(demoRole);
    } else {
      fetchProfile();
    }
  }, []);

  const doLogout = () => {
    localStorage.removeItem("accessToken");
    setUser(null);
  };

  // ─── LOGIN ────────────────────────────────────────────────────────────────
  const login = async (email, password) => {
    try {
      const res = await axios.post("/auth/login", { email, password });
      // Backend shape: { success, statusCode, message, data: { user, accessToken } }
      if (res.data && res.data.success && res.data.data) {
        const { accessToken, user: userData } = res.data.data;
        localStorage.setItem("accessToken", accessToken);
        setUser(userData);
        return { success: true };
      }
      return { success: false, message: res.data?.message || "Login failed" };
    } catch (err) {
      const message = err.response?.data?.message || "Invalid credentials. Please try again.";
      return { success: false, message };
    }
  };

  // ─── LOGOUT ───────────────────────────────────────────────────────────────
  const logout = async () => {
    try {
      await axios.post("/auth/logout");
    } catch {
      // Ignore errors, clear local state anyway
    }
    doLogout();
  };

  // ─── REGISTER ─────────────────────────────────────────────────────────────
  const register = async (fullName, email, password, role) => {
    try {
      const res = await axios.post("/auth/register", { fullName, email, password, role });
      // Backend shape: { success: true, statusCode: 201, message: "User Registered Successfully", data: {...} }
      if (res.data && res.data.success) {
        return { success: true, message: res.data.message || "Registration successful!" };
      }
      return { success: false, message: res.data?.message || "Registration failed" };
    } catch (err) {
      const message = err.response?.data?.message || "Registration failed. Please try again.";
      return { success: false, message };
    }
  };

  // ─── FORGOT PASSWORD ──────────────────────────────────────────────────────
  const forgotPassword = async (email) => {
    try {
      const res = await axios.post("/auth/forgot-password", { email });
      if (res.data && res.data.success) {
        return { success: true, message: res.data.message || "OTP sent to your email!" };
      }
      return { success: false, message: res.data?.message || "Request failed" };
    } catch (err) {
      const message = err.response?.data?.message || "Could not send OTP. Check your email address.";
      return { success: false, message };
    }
  };

  // ─── VERIFY OTP ───────────────────────────────────────────────────────────
  const verifyOtp = async (email, otp) => {
    try {
      const res = await axios.post("/auth/verify-otp", { email, otp });
      if (res.data && res.data.success) {
        return { success: true, message: res.data.message || "OTP verified!" };
      }
      return { success: false, message: res.data?.message || "OTP verification failed" };
    } catch (err) {
      const message = err.response?.data?.message || "Invalid OTP. Please try again.";
      return { success: false, message };
    }
  };

  // ─── RESET PASSWORD ───────────────────────────────────────────────────────
  const resetPassword = async (email, otp, password) => {
    try {
      const res = await axios.post("/auth/reset-password", { email, otp, password });
      if (res.data && res.data.success) {
        return { success: true, message: res.data.message || "Password reset successful!" };
      }
      return { success: false, message: res.data?.message || "Reset failed" };
    } catch (err) {
      const message = err.response?.data?.message || "Password reset failed. Please try again.";
      return { success: false, message };
    }
  };

  // ─── UPDATE PROFILE ────────────────────────────────────────────────────────
  const updateProfile = async (formData) => {
    try {
      const res = await axios.put("/auth/profile", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      if (res.data && res.data.success) {
        setUser(res.data.data);
        return { success: true, message: res.data.message || "Profile updated!" };
      }
      return { success: false, message: res.data?.message || "Failed to update profile" };
    } catch (err) {
      const message = err.response?.data?.message || "Error updating profile.";
      return { success: false, message };
    }
  };

  // ─── CHANGE PASSWORD ───────────────────────────────────────────────────────
  const changePassword = async (oldPassword, newPassword) => {
    try {
      const res = await axios.put("/auth/change-password", { oldPassword, newPassword });
      if (res.data && res.data.success) {
        return { success: true, message: res.data.message || "Password updated successfully!" };
      }
      return { success: false, message: res.data?.message || "Failed to update password" };
    } catch (err) {
      const message = err.response?.data?.message || "Password update failed.";
      return { success: false, message };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role,
        roleLabel: getRoleLabel(user?.role),
        loading,
        isAuthenticated: !!user,
        demoMode,
        accessibleModules: getAccessibleModules(user?.role),
        canAccessModule: (moduleKey) => canAccessModule(user?.role, moduleKey),
        homePath: getDefaultRouteForRole(user?.role),
        login,
        logout,
        register,
        forgotPassword,
        verifyOtp,
        resetPassword,
        updateProfile,
        changePassword,
        refreshUser: fetchProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
