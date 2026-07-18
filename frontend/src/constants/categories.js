// ─── Product Category Master List ────────────────────────────────────────────
// Each category has a name, default unit, and optional description.
// Categories are stored in localStorage so newly created ones persist.

const DEFAULT_CATEGORIES = [
  { name: "Tablet",    unit: "Strip",    description: "Solid oral dosage forms" },
  { name: "Capsule",   unit: "Strip",    description: "Gelatin-enclosed medicines" },
  { name: "Syrup",     unit: "Bottle",   description: "Liquid oral formulations" },
  { name: "Injection", unit: "Vial",     description: "Injectable preparations" },
  { name: "Drops",     unit: "Bottle",   description: "Ophthalmic/nasal/ear drops" },
  { name: "Ointment",  unit: "Tube",     description: "Topical preparations" },
  { name: "Powder",    unit: "Sachet",   description: "Powder formulations" },
  { name: "Inhaler",   unit: "Piece",    description: "Respiratory inhalers" },
  { name: "Cream",     unit: "Tube",     description: "Topical cream preparations" },
  { name: "Gel",       unit: "Tube",     description: "Gel-based medicines" },
  { name: "Other",     unit: "Piece",    description: "Miscellaneous categories" },
];

const STORAGE_KEY = "pharma_erp_categories";

// Load from localStorage, falling back to defaults
export const getCategories = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // ignore parse errors
  }
  // Initialize with defaults
  localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_CATEGORIES));
  return DEFAULT_CATEGORIES;
};

// Add a new category
export const addCategory = (category) => {
  const categories = getCategories();
  // Check duplicate
  if (categories.some((c) => c.name.toLowerCase() === category.name.toLowerCase())) {
    return { success: false, message: "Category already exists" };
  }
  const updated = [...categories, category];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return { success: true, categories: updated };
};

// Get category options for <Select> component
export const getCategoryOptions = () => {
  return getCategories().map((c) => ({
    value: c.name,
    label: `${c.name} (${c.unit})`,
  }));
};

// Get filter options (with "All" option)
export const getCategoryFilterOptions = () => {
  return [
    { value: "", label: "All Categories" },
    ...getCategories().map((c) => ({
      value: c.name,
      label: c.name,
    })),
  ];
};

// Available unit options for creating new categories
export const UNIT_OPTIONS = [
  { value: "Strip",  label: "Strip" },
  { value: "Bottle", label: "Bottle" },
  { value: "Vial",   label: "Vial" },
  { value: "Tube",   label: "Tube" },
  { value: "Piece",  label: "Piece" },
  { value: "Sachet", label: "Sachet" },
  { value: "Box",    label: "Box" },
  { value: "Packet", label: "Packet" },
  { value: "Roll",   label: "Roll" },
  { value: "Ampoule",label: "Ampoule" },
  { value: "Kit",    label: "Kit" },
  { value: "Litre",  label: "Litre" },
  { value: "Kg",     label: "Kg" },
];
