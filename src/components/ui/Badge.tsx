import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "gold" | "success" | "warning";
  className?: string;
}

const variants = {
  default: "bg-zinc-800 text-zinc-300 border-zinc-700",
  gold: "bg-amber-500/10 text-amber-400 border-amber-500/30",
  success: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
  warning: "bg-orange-500/10 text-orange-400 border-orange-500/30",
};

export function Badge({
  children,
  variant = "default",
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
