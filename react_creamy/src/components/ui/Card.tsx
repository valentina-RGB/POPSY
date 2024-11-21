// components/ui/card.tsx
import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

const Card = ({ children, className = "", ...props }: CardProps) => {
  return (
    <div className={`tw-bg-white tw-rounded-lg tw-border tw-shadow-sm ${className}`} {...props}>
      {children}
    </div>
  );
};

const CardHeader = ({ children, className = "", ...props }: CardProps) => {
  return (
    <div className={`tw-flex tw-flex-col tw-space-y-1.5 tw-p-6 ${className}`} {...props}>
      {children}
    </div>
  );
};

const CardContent = ({ children, className = "", ...props }: CardProps) => {
  return (
    <div className={`tw-p-6 tw-pt-0 ${className}`} {...props}>
      {children}
    </div>
  );
};

const CardFooter = ({ children, className = "", ...props }: CardProps) => {
  return (
    <div className={`tw-flex tw-items-center tw-p-6 tw-pt-0 ${className}`} {...props}>
      {children}
    </div>
  );
};

const CardTitle: React.FC<{ className?: string; children: React.ReactNode }> = ({ className = "", children, ...props }) => {
  return (
    <h3 
      className={`tw-text-2xl tw-font-semibold tw-leading-none tw-tracking-tight ${className}`} 
      {...props}
    >
      {children}
    </h3>
  );
};

export { Card, CardHeader, CardContent, CardFooter, CardTitle };
