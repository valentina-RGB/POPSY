// components/ui/badge.tsx
import React from "react";

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "destructive";
  className?: string;
}

const Badge = ({ 
  children, 
  variant = "default", 
  className = "", 
  ...props 
}: BadgeProps) => {
  const variantClasses = {
    default: "tw-bg-gray-100 tw-text-gray-900",
    success: "tw-bg-green-100 tw-text-green-800",
    warning: "tw-bg-yellow-100 tw-text-yellow-800",
    destructive: "tw-bg-red-100 tw-text-red-800",
  };

  return (
    <div
      className={`tw-inline-flex tw-items-center tw-rounded-full tw-px-2.5 tw-py-0.5 tw-text-xs tw-font-semibold tw-transition-colors tw-focus:outline-none tw-focus:ring-2 tw-focus:ring-ring tw-focus:ring-offset-2 ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export { Badge };