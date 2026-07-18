// ─── Department Master List ──────────────────────────────────────────────────
// Departments are for employee info / organizational structure.
// These are NOT the same as Roles (Admin, HR, Sales, Employee) used for authorization.

export const DEPARTMENTS = [
  "IT",
  "HR",
  "Admin",
  "Sales",
  "Employee",
];

// Convert to Select component format
export const DEPARTMENT_OPTIONS = DEPARTMENTS.map((d) => ({
  value: d,
  label: d,
}));

export const getDepartmentOptionsForRole = (role) => {
  if (role === "admin") {
    return DEPARTMENT_OPTIONS;
  }

  return DEPARTMENT_OPTIONS.filter((option) => !["HR", "Admin"].includes(option.value));
};

export const getDefaultDepartmentForRole = (role) => {
  const options = getDepartmentOptionsForRole(role);
  return options[0]?.value || "";
};
