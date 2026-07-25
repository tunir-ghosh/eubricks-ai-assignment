import { motion, type HTMLMotionProps } from "framer-motion";
import { forwardRef } from "react";
import clsx from "clsx";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends Omit<HTMLMotionProps<"button">, "ref"> {
  variant?: Variant;
  size?: Size;
}

const sizeClasses: Record<Size, string> = {
  sm: "px-4 py-2 text-sm rounded-xl",
  md: "px-6 py-3 text-sm rounded-2xl",
  lg: "px-8 py-4 text-base rounded-2xl",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", className, children, ...props }, ref) => {
    const base =
      variant === "primary" ? "btn-primary" : variant === "secondary" ? "btn-secondary" : "";

    return (
      <motion.button
        ref={ref}
        whileHover={variant === "ghost" ? undefined : { scale: 1.015 }}
        whileTap={{ scale: 0.97 }}
        transition={{ duration: 0.15, ease: "easeOut" }}
        className={clsx(
          base,
          sizeClasses[size],
          variant === "ghost" &&
            "text-white/60 hover:text-white transition-colors rounded-xl px-3 py-2",
          className
        )}
        {...props}
      >
        {children}
      </motion.button>
    );
  }
);

Button.displayName = "Button";
