// components/ui/button.tsx
import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "default" | "primary" | "secondary" | "destructive";
  size?: "sm" | "md" | "lg";
  className?: string;
}

const Button = ({ 
  children, 
  variant = "default", 
  size = "md", 
  className = "", 
  ...props 
}: ButtonProps) => {
  const variantClasses = {
    default: "tw-bg-white tw-text-gray-900 tw-border tw-border-gray-300 hover:tw-bg-gray-100",
    primary: "tw-bg-blue-600 tw-text-white hover:tw-bg-blue-700",
    secondary: "tw-bg-gray-600 tw-text-white hover:tw-bg-gray-700",
    destructive: "tw-bg-red-600 tw-text-white hover:tw-bg-red-700",
  };

  const sizeClasses = {
    sm: "tw-px-3 tw-py-1.5 tw-text-sm",
    md: "tw-px-4 tw-py-2",
    lg: "tw-px-6 tw-py-3 tw-text-lg",
  };

  return (
    <button
      className={`tw-inline-flex tw-items-center tw-justify-center tw-rounded-md tw-font-medium tw-transition-colors tw-focus:outline-none tw-focus:ring-2 tw-focus:ring-offset-2 tw-disabled:opacity-50 tw-disabled:pointer-events-none ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export { Button };