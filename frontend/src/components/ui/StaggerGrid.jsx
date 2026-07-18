import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "../../lib/animations";
import { cn } from "../../lib/utils";

const StaggerGrid = ({ children, className, as = "div", itemClassName }) => {
  const Tag = motion[as];
  return (
    <Tag
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className={className}
    >
      {Array.isArray(children)
        ? children.map((child, i) => (
            <motion.div key={i} variants={staggerItem} className={itemClassName}>
              {child}
            </motion.div>
          ))
        : <motion.div variants={staggerItem}>{children}</motion.div>
      }
    </Tag>
  );
};

export const StaggerItem = ({ children, className }) => (
  <motion.div variants={staggerItem} className={cn(className)}>
    {children}
  </motion.div>
);

export default StaggerGrid;
