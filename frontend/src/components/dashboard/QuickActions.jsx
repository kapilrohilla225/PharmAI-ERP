import React from "react";
import { Link } from "react-router-dom";
import { UserPlus, PackagePlus, ShoppingCart, ReceiptText } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const actions = [
  {
    title: "Add Employee",
    icon: UserPlus,
    color: "from-blue-600 to-blue-800",
    path: "/employees",
    moduleKey: "employees",
  },
  {
    title: "Add Product",
    icon: PackagePlus,
    color: "from-green-600 to-green-800",
    path: "/inventory",
    moduleKey: "products",
  },
  {
    title: "New Purchase",
    icon: ShoppingCart,
    color: "from-orange-600 to-orange-800",
    path: "/purchases",
    moduleKey: "purchases",
  },
  {
    title: "New Sale",
    icon: ReceiptText,
    color: "from-purple-600 to-purple-800",
    path: "/sales",
    moduleKey: "sales",
  },
];

const QuickActions = () => {
  const { canAccessModule } = useAuth();
  const visibleActions = actions.filter((action) => canAccessModule(action.moduleKey));

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <h2 className="mb-5 text-lg font-bold text-white">Quick Actions</h2>
      <div className="grid grid-cols-2 gap-3">
        {visibleActions.length > 0 ? visibleActions.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.title}
              to={item.path}
              className="group flex flex-col items-center justify-center gap-2.5 rounded-xl border border-slate-700/60 bg-slate-800/40 p-4 text-sm font-semibold text-white transition hover:border-slate-600 hover:bg-slate-800/80"
            >
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${item.color} shadow-lg`}>
                <Icon size={18} className="text-white" />
              </div>
              <span className="text-xs">{item.title}</span>
            </Link>
          );
        }) : (
          <div className="col-span-2 rounded-xl border border-slate-800 bg-slate-950/50 p-4 text-center text-sm text-slate-500">
            No direct actions are assigned to this role.
          </div>
        )}
      </div>
    </div>
  );
};

export default QuickActions;