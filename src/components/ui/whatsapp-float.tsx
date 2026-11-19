import { useEffect, useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";

/** Floating WhatsApp button with a greeting bubble that shows up after a few seconds. */
export function WhatsappFloat({ phone, message = "Olá! Vim pelo site.", greeting = "Oi! Posso te ajudar?", delayMs = 4000, className }: { phone: string; message?: string; greeting?: string; delayMs?: number; className?: string }) {
  const [bubble, setBubble] = useState(false);
  useEffect(() => { const t = setTimeout(() => setBubble(true), delayMs); return () => clearTimeout(t); }, [delayMs]);
  const digits = phone.replace(/\D/g, "");
  const href = `https://wa.me/${digits.length <= 11 ? `55${digits}` : digits}?text=${encodeURIComponent(message)}`;
  return (
    <div className={cn("fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-[max(1rem,env(safe-area-inset-right))] sm:bottom-5 sm:right-5 z-50 flex items-end gap-2.5 sm:gap-3", className)}>
      {bubble && (
        <div className="relative mb-1.5 sm:mb-2 max-w-[190px] sm:max-w-[220px] rounded-2xl rounded-br-sm bg-white px-3.5 py-2.5 sm:px-4 sm:py-3 text-xs sm:text-sm text-zinc-800 shadow-xl animate-in fade-in slide-in-from-bottom-2">
          {greeting}
          <button type="button" onClick={() => setBubble(false)} aria-label="Fechar" className="absolute -right-2 -top-2 grid h-7 w-7 sm:h-6 sm:w-6 place-items-center rounded-full bg-zinc-200 text-zinc-700 shadow-sm touch-manipulation"><X className="h-3.5 w-3.5 sm:h-3 sm:w-3" /></button>
        </div>
      )}
      <a href={href} target="_blank" rel="noopener noreferrer" aria-label="Conversar no WhatsApp" className="relative grid h-12 w-12 sm:h-14 sm:w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-105 active:scale-95 touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black">
        <span aria-hidden className="absolute inset-0 motion-safe:animate-ping rounded-full bg-[#25D366] opacity-30" />
        <MessageCircle className="relative h-6 w-6 sm:h-7 sm:w-7" />
      </a>
    </div>
  );
}
