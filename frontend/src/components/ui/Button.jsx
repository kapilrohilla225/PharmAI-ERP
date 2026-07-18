import { cn } from "../../lib/utils";

const Button = ({
  children,
  type = "button",
  variant = "primary",
  className,
  ...props
}) => {
  const variants = {
    primary:
      "bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white shadow-lg shadow-blue-900/20",
    secondary:
      "bg-slate-900 hover:bg-slate-800 text-white border border-slate-700",
    danger:
      "bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white shadow-lg shadow-rose-900/20",
  };

  return (
    <button
      type={type}
      className={cn(
        "w-full rounded-xl px-5 py-3 font-semibold transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;