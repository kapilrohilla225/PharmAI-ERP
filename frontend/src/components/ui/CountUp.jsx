import { useEffect, useRef, useState } from "react";
import { useInView, motion } from "framer-motion";

const CountUp = ({ end, duration = 1.5, prefix = "", suffix = "", decimals = 0, className }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let startTime;
    const animate = (time) => {
      if (!startTime) startTime = time;
      const elapsed = (time - startTime) / 1000;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(eased * end);
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [isInView, end, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}{count.toFixed(decimals)}{suffix}
    </span>
  );
};

export default CountUp;
