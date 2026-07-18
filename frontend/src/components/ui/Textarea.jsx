import React from "react";
import { cn } from "../../lib/utils";

const Textarea = React.forwardRef(({
  className,
  ...props
}, ref) => {
  return (
    <div className="flex rounded-xl border border-slate-700 bg-slate-800 px-4 w-full">
      <textarea
        ref={ref}
        className={cn(
          "w-full bg-transparent py-4 text-white outline-none placeholder:text-slate-500 min-h-[100px] resize-y",
          className
        )}
        {...props}
      />
    </div>
  );
});

Textarea.displayName = "Textarea";

export default Textarea;
