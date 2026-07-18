import { motion } from "framer-motion";
import { pageTransition } from "../../lib/animations";

const AnimatedPage = ({ children, className }) => {
  return (
    <motion.div
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedPage;
