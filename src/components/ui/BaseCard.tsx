import { ReactNode } from "react";

interface BaseCardProps {
    children: ReactNode;
    className?: string;
    noPadding?: boolean;
}

/**
 * Global standardized card container ensuring absolute uniformity 
 * for border radius, background color, shadow, and internal paddings.
 */
export default function BaseCard({ children, className = "", noPadding = false }: BaseCardProps) {
    return (
        <div
            className={`bg-slate-900 border border-slate-700/50 rounded-2xl shadow-xl shadow-black/20 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/40 hover:border-slate-600/60 transition-all duration-200 ${!noPadding ? "p-6" : ""
                } ${className}`.trim()}
        >
            {children}
        </div>
    );
}
