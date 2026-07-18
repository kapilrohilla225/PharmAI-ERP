import React from "react";
import { cn } from "../../lib/utils";

const Select = React.forwardRef(({
  options = [],
  icon: Icon,
  className,
  placeholder,
  ...props
}, ref) => {
  return (
    <div className="flex items-center rounded-xl border border-slate-700 bg-slate-800 px-4 w-full">
      {Icon && <Icon size={18} className="text-slate-500 mr-2" />}
      <select
        ref={ref}
        className={cn(
          "w-full bg-transparent py-4 text-white outline-none placeholder:text-slate-500 cursor-pointer [&>option]:bg-slate-900 [&>option]:text-white",
          className
        )}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
});

Select.displayName = "Select";

export default Select;
