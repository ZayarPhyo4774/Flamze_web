import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "gold";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-red-600 text-white hover:bg-red-500 shadow-lg shadow-red-900/30 active:scale-[0.98]",
  secondary:
    "bg-zinc-800 text-zinc-100 border border-zinc-700 hover:bg-zinc-700 active:scale-[0.98]",
  ghost: "bg-transparent text-zinc-300 hover:bg-zinc-800/60 hover:text-white",
  danger: "bg-red-900/50 text-red-300 border border-red-800 hover:bg-red-900",
  gold: "bg-gradient-to-r from-amber-500 to-yellow-600 text-black font-semibold hover:from-amber-400 hover:to-yellow-500 shadow-lg shadow-amber-900/30 active:scale-[0.98]",
};

const sizes: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-sm rounded-lg",
  md: "px-4 py-2.5 text-sm rounded-xl",
  lg: "px-6 py-3 text-base rounded-xl",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", disabled, ...props }, ref) => (
    <button
      ref={ref}
      disabled={disabled}
      className={cn(
        "inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  )
);

Button.displayName = "Button";
