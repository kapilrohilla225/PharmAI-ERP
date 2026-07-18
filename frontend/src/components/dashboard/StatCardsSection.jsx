import React from "react";
import { Users, Pill, ShoppingCart, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
import StatCard from "../ui/StatCard";

const StatCardsSection = ({ stats }) => {
  const cards = [
    {
      title: "Total Employees",
      value: stats?.totalEmployees ?? 0,
      icon: Users,
      color: "text-sky-400",
    },
    {
      title: "Total Products",
      value: stats?.totalProducts ?? 0,
      icon: Pill,
      color: "text-emerald-400",
    },
    {
      title: "Total Purchases",
      value: stats?.totalPurchases ?? 0,
      icon: ShoppingCart,
      color: "text-orange-400",
    },
    {
      title: "Low Stock Items",
      value: stats?.lowStockProducts ?? 0,
      icon: AlertTriangle,
      color: "text-rose-400",
    },
  ];

  return (
    <div className="grid gap-5 grid-cols-2 xl:grid-cols-4">
      {cards.map((card, index) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.08 }}
        >
          <StatCard {...card} />
        </motion.div>
      ))}
    </div>
  );
};

export default StatCardsSection;