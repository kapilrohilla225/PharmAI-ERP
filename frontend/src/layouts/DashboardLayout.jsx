import { Outlet, useLocation } from "react-router-dom";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";
import AIChatBot from "../components/ai/AIChatBot";
import ParticleBackground from "../components/ui/ParticleBackground";
import DemoBanner from "../components/layout/DemoBanner";

const pageVariants = {
  initial: { opacity: 0, y: 12, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] } },
  exit: { opacity: 0, y: -8, scale: 0.98, transition: { duration: 0.18, ease: "easeIn" } },
};

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  return (
    <div className="relative h-screen overflow-hidden bg-slate-950 text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.16),_transparent_32%),radial-gradient(circle_at_top_right,_rgba(14,165,233,0.10),_transparent_28%),linear-gradient(180deg,_rgba(15,23,42,0.95)_0%,_rgba(2,6,23,1)_100%)]" />
      <ParticleBackground color="rgba(59,130,246,0.04)" count={20} />
      <div className="relative flex h-screen">

        <Sidebar
          mobileOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          isCollapsed={isCollapsed}
        />

        <div className="flex h-screen flex-1 flex-col overflow-hidden">

          <Navbar
            onMenuClick={() => setSidebarOpen((value) => !value)}
            onCollapseToggle={() => setIsCollapsed(!isCollapsed)}
            isCollapsed={isCollapsed}
          />

          <DemoBanner />

          <main className="flex-1 overflow-y-auto px-4 py-6 md:px-6 lg:px-8 xl:px-10">
            <div className="mx-auto w-full max-w-[1600px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={location.pathname}
                  variants={pageVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                  <Outlet />
                </motion.div>
              </AnimatePresence>
            </div>
          </main>

        </div>

      </div>

      <AIChatBot />
    </div>
  );
};

export default DashboardLayout;