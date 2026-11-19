import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/** A matrix of dots rippling in a slow wave, like a calm data surface. */
export function DotWave({ children, className, color = "255, 255, 255", gap = 22 }: { children?: ReactNode; className?: string; color?: string; gap?: number }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const el = canvas.current!;
    const ctx = el.getContext("2d")!;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0, h = 0, frame = 0;
    let inView = true;
    let tabVisible = !document.hidden;

    const resize = () => {
      const nextW = el.clientWidth;
      const nextH = el.clientHeight;
      const maxDpr = nextW < 768 ? 1.5 : 2;
      const dpr = Math.min(window.devicePixelRatio || 1, maxDpr);
      w = nextW;
      h = nextH;
      el.width = Math.max(1, Math.round(w * dpr));
      el.height = Math.max(1, Math.round(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = (t: number) => {
      frame = 0;
      if (!inView || !tabVisible) return;
      ctx.clearRect(0, 0, w, h);
      const cx = w / 2, cy = h * 0.55;
      for (let x = gap / 2; x < w; x += gap) {
        for (let y = gap / 2; y < h; y += gap) {
          const d = Math.hypot(x - cx, (y - cy) * 1.4);
          const wave = Math.sin(d / 38 - t / 700) * 0.5 + 0.5;
          const fade = Math.max(0, 1 - d / (Math.max(w, h) * 0.75));
          ctx.fillStyle = `rgba(${color}, ${(0.08 + wave * 0.55) * fade})`;
          ctx.beginPath(); ctx.arc(x, y, 0.8 + wave * 1.4, 0, Math.PI * 2); ctx.fill();
        }
      }
      if (!reduced && inView && tabVisible) frame = requestAnimationFrame(draw);
    };

    const startLoop = () => {
      if (!frame && inView && tabVisible) {
        frame = requestAnimationFrame(draw);
      }
    };

    const stopLoop = () => {
      if (frame) {
        cancelAnimationFrame(frame);
        frame = 0;
      }
    };

    resize();
    startLoop();

    const ro = new ResizeObserver(() => {
      resize();
      if (reduced && inView && tabVisible) {
        stopLoop();
        startLoop();
      }
    });
    ro.observe(el);

    const io = new IntersectionObserver(
      (entries) => {
        inView = entries[0]?.isIntersecting ?? true;
        if (inView) startLoop();
        else stopLoop();
      },
      { threshold: 0.01 }
    );
    io.observe(el);

    const onVisibilityChange = () => {
      tabVisible = !document.hidden;
      if (tabVisible) startLoop();
      else stopLoop();
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      stopLoop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [color, gap]);
  return (
    <div className={cn("relative isolate flex min-h-[520px] w-full items-center justify-center overflow-hidden bg-black text-white", className)}>
      <canvas ref={canvas} aria-hidden className="absolute inset-0 -z-10 h-full w-full" />
      {children}
    </div>
  );
}
