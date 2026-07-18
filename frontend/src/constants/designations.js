// ─── Designation Master List ─────────────────────────────────────────────────
// Designations are for employee info / job titles.

export const DESIGNATIONS = [
  "Software Developer",
  "HR Executive",
  "Admin Executive",
  "Sales Executive",
  "Accountant",
  "Finance Executive",
  "Production Executive",
  "QA Executive",
  "QC Executive",
  "Inventory Executive",
  "Purchase Executive",
  "Warehouse Executive",
  "Dispatch Executive",
  "R&D Executive",
];

export const DESIGNATION_OPTIONS = DESIGNATIONS.map((d) => ({
  value: d,
  label: d,
}));

export const DESIGNATION_OPTIONS_BY_DEPARTMENT = {
  IT: [{ value: "Software Developer", label: "Software Developer" }],
  HR: [{ value: "HR Executive", label: "HR Executive" }],
  Admin: [{ value: "Admin Executive", label: "Admin Executive" }],
  Sales: [{ value: "Sales Executive", label: "Sales Executive" }],
  Employee: [
    { value: "Accountant", label: "Accountant" },
    { value: "Finance Executive", label: "Finance Executive" },
    { value: "Production Executive", label: "Production Executive" },
    { value: "QA Executive", label: "QA Executive" },
    { value: "QC Executive", label: "QC Executive" },
    { value: "Inventory Executive", label: "Inventory Executive" },
    { value: "Purchase Executive", label: "Purchase Executive" },
    { value: "Warehouse Executive", label: "Warehouse Executive" },
    { value: "Dispatch Executive", label: "Dispatch Executive" },
    { value: "R&D Executive", label: "R&D Executive" },
  ],
};

export const getDesignationOptionsForDepartment = (department) =>
  DESIGNATION_OPTIONS_BY_DEPARTMENT[department] || DESIGNATION_OPTIONS;