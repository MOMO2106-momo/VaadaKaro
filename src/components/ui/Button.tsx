"use client";

import { ButtonHTMLAttributes, forwardRef } from "react";
import Link from "next/link";
import { LucideIcon } from "lucide-react";
import { Loader2 } from "lucide-react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  icon?: LucideIcon;
  iconPosition?: "left" | "right";
  href?: string;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      loading = false,
      icon,
      iconPosition = "right",
      children,
      className = "",
      disabled,
      href,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center gap-2 font-bold rounded-xl transition-all focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed";

    const variantStyles = {
      primary: "text-white",
      secondary: "text-slate-300 border border-slate-700",
      outline: "text-slate-300 border-2 border-slate-700",
      ghost: "text-slate-300",
      danger: "text-white",
    };

    const variantInlineStyles: Record<string, React.CSSProperties> = {
      primary: { backgroundColor: '#059669', boxShadow: '0 4px 20px rgba(5,150,105,0.4)' },
      secondary: { backgroundColor: '#1e293b' },
      outline: { backgroundColor: 'transparent' },
      ghost: { backgroundColor: 'transparent' },
      danger: { backgroundColor: '#dc2626', boxShadow: '0 4px 20px rgba(220,38,38,0.35)' },
    };

    const sizeStyles = {
      sm: "px-4 py-2.5 text-sm",
      md: "px-6 py-3.5 text-[15px]",
      lg: "px-8 py-4 text-base",
    };

    const IconComponent = loading ? Loader2 : icon;
    const iconElement = IconComponent ? <IconComponent size={18} /> : null;

    const buttonContent = (
      <>
        {iconPosition === "left" && iconElement}
        {children}
        {iconPosition === "right" && iconElement}
      </>
    );

    if (href && !disabled && !loading) {
      return (
        <Link
          href={href}
          className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
          style={variantInlineStyles[variant]}
          ref={ref as any}
        >
          {buttonContent}
        </Link>
      );
    }

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
        style={variantInlineStyles[variant]}
        disabled={disabled || loading}
        {...props}
      >
        {buttonContent}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };