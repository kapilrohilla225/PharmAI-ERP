import { cn } from "../../lib/utils";

const Skeleton = ({ className, variant = "rect", width, height }) => {
  const base = "relative overflow-hidden rounded-xl bg-slate-800/60";
  const shimmer = "before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.5s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/5 before:to-transparent";

  const styles = {
    rect: "",
    circle: "rounded-full",
    text: "h-4 rounded-md",
    title: "h-6 rounded-lg",
  };

  return (
    <div
      className={cn(base, shimmer, styles[variant], className)}
      style={{ width, height }}
    />
  );
};

export const SkeletonCard = ({ lines = 3 }) => (
  <div className="rounded-2xl border border-slate-800/80 bg-slate-900/70 p-5 space-y-4">
    <Skeleton variant="title" className="w-3/5" />
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton key={i} variant="text" className={i === lines - 1 ? "w-4/5" : "w-full"} />
    ))}
  </div>
);

export const SkeletonTable = ({ rows = 5, cols = 6 }) => (
  <div className="rounded-2xl border border-slate-800/80 bg-slate-900/70 overflow-hidden">
    <div className="grid grid-cols-6 gap-4 border-b border-slate-800/60 p-4">
      {Array.from({ length: cols }).map((_, i) => (
        <Skeleton key={i} variant="text" className="w-4/5" />
      ))}
    </div>
    {Array.from({ length: rows }).map((_, r) => (
      <div key={r} className="grid grid-cols-6 gap-4 border-b border-slate-800/40 p-4">
        {Array.from({ length: cols }).map((_, c) => (
          <Skeleton key={c} variant="text" className={c === 0 ? "w-3/5" : "w-full"} />
        ))}
      </div>
    ))}
  </div>
);

export default Skeleton;
