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

export { Card, CardHeader, CardContent, CardFooter };