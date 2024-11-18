// components/ui/skeleton.tsx
import React from "react";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

const Skeleton = ({ className = "", ...props }: SkeletonProps) => {
  return (
    <div
      className={`tw-animate-pulse tw-rounded-md tw-bg-gray-200 ${className}`}
      {...props}
    />
  );
};

export { Skeleton };