"use client";

import { HTMLAttributes, forwardRef } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "elevated" | "outline";
  padding?: "none" | "sm" | "md" | "lg";
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ variant = "default", padding = "lg", className = "", children, ...props }, ref) => {
    const baseStyles = "rounded-2xl shadow-sm transition-all";
    
    const variantStyles = {
      default: "bg-[#0F172A] border border-slate-800",
      elevated: "bg-[#0F172A] border border-slate-800 shadow-md",
      outline: "bg-transparent border-2 border-slate-700",
    };

    const paddingStyles = {
      none: "",
      sm: "p-4",
      md: "p-6",
      lg: "p-8 lg:p-10",
    };

    return (
      <div
        ref={ref}
        className={`${baseStyles} ${variantStyles[variant]} ${paddingStyles[padding]} ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";

export { Card };