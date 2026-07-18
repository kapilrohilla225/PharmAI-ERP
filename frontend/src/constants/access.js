export const ROLES = {
  ADMIN: "admin",
  HR: "hr",
  SALES: "sales",
  EMPLOYEE: "employee",
};

export const ROLE_LABELS = {
  admin: "Administrator",
  hr: "Human Resources",
  sales: "Sales Manager",
  employee: "Employee",
};

// Fine-grained permission flags per module per role
export const PERMISSIONS = {
  // Dashboard: what each role sees
  dashboard: {
    admin:    { access: true,  view: "full" },
    hr:       { access: true,  view: "hr" },       // employee stats only, no revenue
    sales:    { access: true,  view: "sales" },    // today's sales, monthly, top products
    employee: { access: true,  view: "personal" }, // personal dashboard
  },

  // Employees
  employees: {
    admin:    { access: true,  canAdd: true,  canEdit: true,  canDelete: true,  canViewSalary: true,  viewMode: "all" },
    hr:       { access: true,  canAdd: true,  canEdit: true,  canDelete: false, canViewSalary: false, viewMode: "all" },
    sales:    { access: true,  canAdd: false, canEdit: false, canDelete: false, canViewSalary: false, viewMode: "readonly" },
    employee: { access: false, canAdd: false, canEdit: false, canDelete: false, canViewSalary: false, viewMode: "own" },
  },

  // Products
  products: {
    admin:    { access: true, canWrite: true  },
    hr:       { access: true, canWrite: false },
    sales:    { access: true, canWrite: false },
    employee: { access: true, canWrite: false },
  },

  // Suppliers
  suppliers: {
    admin:    { access: true, canWrite: true,  canDelete: true  },
    hr:       { access: true, canWrite: true,  canDelete: false },
    sales:    { access: true, canWrite: false, canDelete: false },
    employee: { access: false, canWrite: false, canDelete: false },
  },

  // Inventory
  inventory: {
    admin:    { access: true, canAdjust: true  },
    hr:       { access: true, canAdjust: false },
    sales:    { access: true, canAdjust: false },
    employee: { access: false, canAdjust: false },
  },

  // Sales
  sales: {
    admin:    { access: true,  canCreate: true,  canInvoice: true  },
    hr:       { access: true,  canCreate: false, canInvoice: false }, // view only
    sales:    { access: true,  canCreate: true,  canInvoice: true  },
    employee: { access: false, canCreate: false, canInvoice: false },
  },

  // Purchases
  purchases: {
    admin:    { access: true,  canCreate: true  },
    hr:       { access: false, canCreate: false },
    sales:    { access: true,  canCreate: false }, // view only
    employee: { access: false, canCreate: false },
  },

  // Reports
  reports: {
    admin:    { access: true, tabs: ["sales", "purchases", "inventory", "employees"] },
    hr:       { access: true, tabs: ["employees"] },
    sales:    { access: true, tabs: ["sales"] },
    employee: { access: false, tabs: [] },
  },

  // Settings
  settings: {
    admin:    { access: true  },
    hr:       { access: false },
    sales:    { access: false },
    employee: { access: false },
  },

  // AI Assistant
  ai: {
    admin:    { access: true  },
    hr:       { access: false },
    sales:    { access: false },
    employee: { access: false },
  },
};

// Helper: get permissions for a role+module
export const getPermissions = (role, module) => {
  return PERMISSIONS[module]?.[role] || { access: false };
};

// Sidebar-visible modules per role (items that should appear in the nav)
export const MODULE_ACCESS = {
  dashboard: {
    label: "Dashboard",
    path: "/dashboard",
    roles: [ROLES.ADMIN, ROLES.HR, ROLES.SALES, ROLES.EMPLOYEE],
  },
  notifications: {
    label: "Notifications",
    path: "/notifications",
    roles: [ROLES.ADMIN, ROLES.HR, ROLES.SALES, ROLES.EMPLOYEE],
  },
  employees: {
    label: "Employees",
    path: "/employees",
    roles: [ROLES.ADMIN, ROLES.HR, ROLES.SALES],
  },
  products: {
    label: "Products",
    path: "/products",
    roles: [ROLES.ADMIN, ROLES.HR, ROLES.SALES, ROLES.EMPLOYEE],
  },
  suppliers: {
    label: "Suppliers",
    path: "/suppliers",
    roles: [ROLES.ADMIN, ROLES.HR, ROLES.SALES],
  },
  inventory: {
    label: "Inventory",
    path: "/inventory",
    roles: [ROLES.ADMIN, ROLES.HR, ROLES.SALES],
  },
  purchases: {
    label: "Purchases",
    path: "/purchases",
    roles: [ROLES.ADMIN, ROLES.SALES],
  },
  sales: {
    label: "Sales",
    path: "/sales",
    roles: [ROLES.ADMIN, ROLES.SALES, ROLES.HR],
  },
  reports: {
    label: "Reports",
    path: "/reports",
    roles: [ROLES.ADMIN, ROLES.HR, ROLES.SALES],
  },
  ai: {
    label: "AI Assistant",
    path: "/ai",
    roles: [ROLES.ADMIN],
  },
  settings: {
    label: "Settings",
    path: "/settings",
    roles: [ROLES.ADMIN],
  },
};

export const ROLE_HOME = {
  admin:    "/dashboard",
  hr:       "/dashboard",
  sales:    "/dashboard",
  employee: "/dashboard",
};

export const getRoleLabel = (role) => ROLE_LABELS[role] || "User";

export const canAccessModule = (role, moduleKey) => {
  const module = MODULE_ACCESS[moduleKey];
  if (!module) return false;
  return module.roles.includes(role);
};

export const getAccessibleModules = (role) =>
  Object.entries(MODULE_ACCESS)
    .filter(([, module]) => module.roles.includes(role))
    .map(([key, module]) => ({ key, ...module }));

export const getDefaultRouteForRole = (role) => ROLE_HOME[role] || "/dashboard";

export const getAllowedRoles = (moduleKey) => MODULE_ACCESS[moduleKey]?.roles || [];
