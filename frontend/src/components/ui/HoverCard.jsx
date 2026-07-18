import { useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

const HoverCard = ({ children, className, tiltDegree = 8, glare = true, scale = 1.02, as = "div" }) => {
  const ref = useRef(null);
  const [transform, setTransform] = useState("");
  const [glareStyle, setGlareStyle] = useState({});

  const handleMouseMove = useCallback((e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -tiltDegree;
    const rotateY = ((x - centerX) / centerX) * tiltDegree;
    setTransform(`perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scale})`);
    if (glare) {
      const glareX = (x / rect.width) * 100;
      const glareY = (y / rect.height) * 100;
      setGlareStyle({
        background: `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.06) 0%, transparent 60%)`,
      });
    }
  }, [tiltDegree, scale, glare]);

  const handleMouseLeave = useCallback(() => {
    setTransform("");
    setGlareStyle({});
  }, []);

  const Tag = motion[as];

  return (
    <Tag
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transform, transition: "transform 0.15s ease-out" }}
      className={cn("relative overflow-hidden", className)}
    >
      {glare && (
        <div
          className="pointer-events-none absolute inset-0 z-10"
          style={glareStyle}
        />
      )}
      {children}
    </Tag>
  );
};

export default HoverCard;
