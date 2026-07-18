export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
};

export const fadeInUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

export const fadeInDown = {
  hidden: { opacity: 0, y: -16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

export const fadeInLeft = {
  hidden: { opacity: 0, x: -16 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

export const fadeInRight = {
  hidden: { opacity: 0, x: 16 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: "easeOut" } },
};

export const slideUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] } },
};

export const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.05,
    },
  },
};

export const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

export const pageTransition = {
  initial: { opacity: 0, y: 12, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] } },
  exit: { opacity: 0, y: -8, scale: 0.98, transition: { duration: 0.2, ease: "easeIn" } },
};

export const hoverScale = {
  whileHover: { scale: 1.03 },
  whileTap: { scale: 0.97 },
  transition: { type: "spring", stiffness: 400, damping: 17 },
};

export const hoverLift = {
  whileHover: { y: -3, boxShadow: "0 12px 30px rgba(0,0,0,0.15)" },
  whileTap: { y: 0 },
  transition: { type: "spring", stiffness: 400, damping: 20 },
};

export const modalBackdrop = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

export const modalContent = {
  hidden: { opacity: 0, scale: 0.93, y: 20 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.25, ease: "easeOut" } },
  exit: { opacity: 0, scale: 0.95, y: 10, transition: { duration: 0.18, ease: "easeIn" } },
};

export const drawerRight = {
  hidden: { x: "100%" },
  visible: { x: 0, transition: { type: "spring", stiffness: 300, damping: 30 } },
  exit: { x: "100%", transition: { type: "spring", stiffness: 300, damping: 30 } },
};

export const kpiCard = {
  hidden: { opacity: 0, y: 24, scale: 0.96 },
  visible: (i = 0) => ({
    opacity: 1, y: 0, scale: 1,
    transition: { delay: i * 0.07, duration: 0.35, ease: "easeOut" },
  }),
};

export const listItem = {
  hidden: { opacity: 0, x: -8 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.25, ease: "easeOut" } },
};

export const pulseGlow = {
  animate: {
    boxShadow: [
      "0 0 0 0 rgba(59, 130, 246, 0)",
      "0 0 0 8px rgba(59, 130, 246, 0.1)",
      "0 0 0 0 rgba(59, 130, 246, 0)",
    ],
    transition: { duration: 2, repeat: Infinity, ease: "easeInOut" },
  },
};

export const shimmer = {
  animate: {
    x: ["-100%", "100%"],
    transition: { duration: 1.5, repeat: Infinity, ease: "linear" },
  },
};
