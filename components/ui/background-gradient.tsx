import { cn } from "@/lib/utils";
import React from "react";
import { motion } from "motion/react";

export const BackgroundGradient = ({
  children,
  className,
  containerClassName,
  animate = false,
}: {
  children?: React.ReactNode;
  className?: string;
  containerClassName?: string;
  animate?: boolean;
}) => {
  return (
    <div className={cn("relative p-[4px] group", containerClassName)}>
      <div className={cn(
        "absolute inset-0 rounded-3xl z-[1] opacity-60 group-hover:opacity-100 transition duration-500 will-change-transform",
        "bg-[#F47937]"
      )} />

      <div className={cn("relative z-10", className)}>{children}</div>
    </div>
  );
};
