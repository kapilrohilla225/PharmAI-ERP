import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AuthLayout from "../layouts/AuthLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import Login from "../pages/auth/Login";
import GoogleSuccess from "../pages/auth/GoogleSuccess";
import Dashboard from "../pages/dashboard/Dashboard";
import Employees from "../pages/employees/Employees";
import Products from "../pages/products/Products";
import Suppliers from "../pages/suppliers/Suppliers";
import Inventory from "../pages/inventory/Inventory";
import Purchases from "../pages/purchases/Purchases";
import Sales from "../pages/sales/Sales";
import Reports from "../pages/reports/Reports";
import AIAssistant from "../pages/ai/AIAssistant";
import Notifications from "../pages/notifications/Notifications";
import Settings from "../pages/settings/Settings";
import Profile from "../pages/profile/Profile";
import ProtectedRoute from "../components/layout/ProtectedRoute";
import AccessDenied from "../components/layout/AccessDenied";
import NotFound from "../pages/notFound/NotFound";
import { MODULE_ACCESS, getDefaultRouteForRole } from "../constants/access";
import { useAuth } from "../context/AuthContext";

const AppRoutes = () => {
  const { isAuthenticated, user } = useAuth();
  const homePath = getDefaultRouteForRole(user?.role);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/" element={<Login />} />
        </Route>
        <Route path="/auth/google/success" element={<GoogleSuccess />} />

        {/* Protected Dashboard Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>

            {/* Available to ALL authenticated roles */}
            <Route path="/dashboard"      element={<Dashboard />} />
            <Route path="/notifications"  element={<Notifications />} />
            <Route path="/profile"        element={<Profile />} />
            <Route path="/access-denied"  element={<AccessDenied />} />

            {/* Employees: Admin, HR, Sales (Employee → redirect to profile) */}
            <Route element={<ProtectedRoute allowedRoles={MODULE_ACCESS.employees.roles} />}>
              <Route path="/employees" element={<Employees />} />
            </Route>

            {/* Products: All roles (view-only enforced on page level) */}
            <Route element={<ProtectedRoute allowedRoles={MODULE_ACCESS.products.roles} />}>
              <Route path="/products"   element={<Products />} />
            </Route>

            {/* Suppliers: Admin, HR, Sales */}
            <Route element={<ProtectedRoute allowedRoles={MODULE_ACCESS.suppliers.roles} />}>
              <Route path="/suppliers" element={<Suppliers />} />
            </Route>

            {/* Inventory: Admin, HR, Sales */}
            <Route element={<ProtectedRoute allowedRoles={MODULE_ACCESS.inventory.roles} />}>
              <Route path="/inventory"  element={<Inventory />} />
            </Route>

            {/* Sales: Admin + Sales + HR (HR = view only, enforced on page level) */}
            <Route element={<ProtectedRoute allowedRoles={MODULE_ACCESS.sales.roles} />}>
              <Route path="/sales" element={<Sales />} />
            </Route>

            {/* Purchases: Admin + Sales only */}
            <Route element={<ProtectedRoute allowedRoles={MODULE_ACCESS.purchases.roles} />}>
              <Route path="/purchases" element={<Purchases />} />
            </Route>

            {/* Reports: Admin + HR + Sales (each sees different tabs) */}
            <Route element={<ProtectedRoute allowedRoles={MODULE_ACCESS.reports.roles} />}>
              <Route path="/reports" element={<Reports />} />
            </Route>

            {/* Admin only */}
            <Route element={<ProtectedRoute allowedRoles={MODULE_ACCESS.ai.roles} />}>
              <Route path="/ai" element={<AIAssistant />} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={MODULE_ACCESS.settings.roles} />}>
              <Route path="/settings" element={<Settings />} />
            </Route>

          </Route>
        </Route>

        {/* 404 */}
        <Route path="/not-found" element={<NotFound />} />
        <Route path="*" element={<Navigate to={isAuthenticated ? homePath : "/"} replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
