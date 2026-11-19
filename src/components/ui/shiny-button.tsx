import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Solid call-to-action with a reflection sweeping across every few seconds. */
export function ShinyButton({ children, className, onClick }: { children: ReactNode; className?: string; onClick?: () => void }) {
  return (
    <button type="button" onClick={onClick} className={cn("relative overflow-hidden rounded-xl bg-emerald-500 px-7 py-3.5 text-sm font-semibold text-emerald-950 shadow-[0_8px_30px_-8px_rgba(16,185,129,0.7)] transition-transform hover:-translate-y-0.5 active:translate-y-0", className)}>
      <style>{`@keyframes shine-pass{0%,60%{transform:translateX(-120%) skewX(-20deg)}100%{transform:translateX(220%) skewX(-20deg)}}`}</style>
      <span aria-hidden className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-white/60 to-transparent motion-safe:animate-[shine-pass_3s_ease-in-out_infinite]" />
      <span className="relative">{children}</span>
    </button>
  );
}
