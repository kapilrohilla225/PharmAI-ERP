import { cn } from "../../lib/utils";
import HoverCard from "./HoverCard";

const Card = ({ children, className, hoverable = false }) => {
  const base = "rounded-3xl border border-slate-800/80 bg-slate-900/70 p-6 shadow-xl shadow-black/20 backdrop-blur";

  if (hoverable) {
    return (
      <HoverCard className={cn(base, className)}>
        {children}
      </HoverCard>
    );
  }

  return (
    <div className={cn(base, className)}>
      {children}
    </div>
  );
};

export default Card;
