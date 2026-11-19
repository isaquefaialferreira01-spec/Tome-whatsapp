import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

/** Full-width header that shrinks into a floating pill once the page scrolls. */
export function FloatingNavbar({ brand, links, cta, className }: { brand: React.ReactNode; links: { label: string; href: string }[]; cta?: { label: string; href: string }; className?: string }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => { const on = () => setScrolled(window.scrollY > 24); on(); window.addEventListener("scroll", on, { passive: true }); return () => window.removeEventListener("scroll", on); }, []);
  return (
    <header className={cn("fixed inset-x-0 top-0 z-50 flex justify-center transition-all duration-500", scrolled ? "pt-3" : "pt-0", className)}>
      <nav className={cn("flex w-full items-center gap-6 px-6 transition-all duration-500", scrolled ? "h-14 max-w-3xl rounded-full border border-black/10 bg-white/80 shadow-lg backdrop-blur-xl dark:border-white/10 dark:bg-zinc-900/80" : "h-20 max-w-6xl bg-transparent")}>
        <div className="font-semibold tracking-tight">{brand}</div>
        <div className="ml-auto hidden items-center gap-6 text-sm text-zinc-600 md:flex dark:text-zinc-300">{links.map(l => { const isExternal = /^https?:\/\//.test(l.href); return <a key={l.href} href={l.href} target={isExternal ? "_blank" : undefined} rel={isExternal ? "noopener noreferrer" : undefined} className="hover:text-zinc-900 dark:hover:text-white">{l.label}</a>; })}</div>
        {cta && (() => { const isExternal = /^https?:\/\//.test(cta.href); return <a href={cta.href} target={isExternal ? "_blank" : undefined} rel={isExternal ? "noopener noreferrer" : undefined} className="ml-auto rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white md:ml-0 dark:bg-white dark:text-zinc-900">{cta.label}</a>; })()}
      </nav>
    </header>
  );
}
