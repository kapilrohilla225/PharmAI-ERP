import React from "react";
import { cn } from "../../lib/utils";

const Loader = ({
  size = "md",
  className,
}) => {
  const sizes = {
    sm: "h-5 w-5 border-2",
    md: "h-8 w-8 border-3",
    lg: "h-12 w-12 border-4",
  };

  return (
    <div className={cn("flex justify-center items-center py-4", className)}>
      <div
        className={cn(
          "animate-spin rounded-full border-t-transparent border-blue-500",
          sizes[size]
        )}
      />
    </div>
  );
};

export default Loader;
