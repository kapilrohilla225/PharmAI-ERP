import React from "react";
import { cn } from "../../lib/utils";

const Input = React.forwardRef(({
  icon: Icon,
  className,
  ...props
}, ref) => {
  return (
    <div className="flex items-center rounded-xl border border-slate-700 bg-slate-800 px-4 w-full">

      {Icon && (
        <Icon
          size={18}
          className="text-slate-500"
        />
      )}

      <input
        ref={ref}
        className={cn(
          "w-full bg-transparent py-4 text-white outline-none placeholder:text-slate-500",
          className
        )}
        {...props}
      />

    </div>
  );
});

Input.displayName = "Input";

export default Input;