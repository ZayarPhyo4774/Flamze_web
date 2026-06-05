"use client";

import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect } from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function Modal({ open, onClose, title, children, className }: ModalProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />
      <div
        className={cn(
          "relative z-10 w-full max-w-lg max-h-[90vh] overflow-y-auto",
          "bg-zinc-950 border border-zinc-800 rounded-t-2xl sm:rounded-2xl",
          "animate-in slide-in-from-bottom-4 duration-300",
          className
        )}
      >
        {title && (
          <div className="flex items-center justify-between border-b border-zinc-800 px-5 py-4">
            <h2 className="text-lg font-semibold text-white">{title}</h2>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        )}
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}
