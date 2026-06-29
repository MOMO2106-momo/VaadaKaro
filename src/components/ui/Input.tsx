"use client";

import { InputHTMLAttributes, forwardRef } from "react";
import { LucideIcon } from "lucide-react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: LucideIcon;
  iconPosition?: "left" | "right";
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      icon: Icon,
      iconPosition = "left",
      className = "",
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || `input-${label?.toLowerCase().replace(/\s+/g, "-")}`;

    return (
      <div className="space-y-2 w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="text-[13.5px] font-bold text-slate-700 dark:text-slate-300 ml-1"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {Icon && iconPosition === "left" && (
            <Icon
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-450 dark:text-slate-500 pointer-events-none z-10"
              size={18}
            />
          )}
          <input
            ref={ref}
            id={inputId}
            style={{
              paddingLeft: Icon && iconPosition === "left" ? "3.25rem" : undefined,
              paddingRight: Icon && iconPosition === "right" ? "3.25rem" : undefined,
            }}
            className={`
              w-full bg-slate-50 dark:bg-[#1A2234] border rounded-xl py-3.5 text-[15px] text-slate-900 dark:text-white
              placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 transition-all
              font-medium shadow-sm shadow-black/5 dark:shadow-black/10
              ${!Icon ? "px-4" : iconPosition === "left" ? "pl-12 pr-4" : "pl-4 pr-12"}
              ${
                error
                  ? "border-rose-550 dark:border-rose-500 focus:border-rose-500 focus:ring-rose-500/20"
                  : "border-slate-200 dark:border-slate-700/50 focus:border-emerald-500 focus:ring-emerald-500/20 hover:border-slate-300 dark:hover:border-slate-600"
              }
              ${className}
            `}
            {...props}
          />
          {Icon && iconPosition === "right" && (
            <Icon
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-450 dark:text-slate-500 pointer-events-none z-10"
              size={18}
            />
          )}
        </div>
        {error && (
          <p className="text-[13px] text-rose-500 dark:text-rose-400 font-semibold ml-1">{error}</p>
        )}
        {helperText && !error && (
          <p className="text-[13px] text-slate-500 dark:text-slate-400 font-medium ml-1">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };