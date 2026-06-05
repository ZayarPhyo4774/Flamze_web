import { cn } from "@/lib/utils";
import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-zinc-300">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={id}
        className={cn(
          "w-full rounded-xl border border-zinc-700 bg-zinc-900/80 px-4 py-2.5 text-sm text-white placeholder:text-zinc-500",
          "focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-colors",
          error && "border-red-500",
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  )
);

Input.displayName = "Input";
