import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ShieldCheck, FileCheck, BadgeCheck } from "lucide-react";
import { NumberTicker } from "./ui/number-ticker";

const TRUST_INDICATORS = [
  {
    id: "procedencia",
    label: "PROCEDÊNCIA",
    Icon: ShieldCheck,
  },
  {
    id: "nota-fiscal",
    label: "NOTA FISCAL",
    Icon: FileCheck,
  },
  {
    id: "garantia",
    label: "GARANTIA",
    Icon: BadgeCheck,
  },
] as const;

export const AuthoritySection: React.FC = () => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section
      id="autoridade"
      aria-labelledby="autoridade-heading"
      className="relative z-20 w-full bg-black text-white border-b border-neutral-800 py-12 sm:py-16 md:py-20 px-4 sm:px-8 lg:px-12"
    >
      <div className="max-w-4xl mx-auto w-full flex flex-col items-center text-center">
        {/* Main Numeric Counter & Supporting Copy */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center"
        >
          <h2 id="autoridade-heading" className="sr-only">
            Mais de 80.000 peças em nosso catálogo com procedência, nota fiscal e garantia
          </h2>

          {/* Reserve exact bounding box width/height for 80.000+ to guarantee zero CLS */}
          <div
            aria-label="80.000+"
            className="inline-grid justify-items-center items-center text-[clamp(3.25rem,11vw,6.5rem)] leading-none tracking-tight select-none"
          >
            <span
              aria-hidden="true"
              className="col-start-1 row-start-1 invisible pointer-events-none tabular-nums font-black"
            >
              80.000+
            </span>
            {prefersReducedMotion ? (
              <span className="col-start-1 row-start-1 tabular-nums font-black text-[#F99B00]">
                80.000+
              </span>
            ) : (
              <NumberTicker
                value={80000}
                durationMs={1800}
                suffix="+"
                decimals={0}
                className="col-start-1 row-start-1 font-black text-[#F99B00]"
              />
            )}
          </div>

          <p className="mt-3 sm:mt-4 text-xs min-[375px]:text-sm sm:text-base md:text-lg font-bold tracking-[0.14em] uppercase text-white">
            PEÇAS EM NOSSO CATÁLOGO
          </p>
        </motion.div>

        {/* Subtle Horizontal Neutral Dark Gray Divider */}
        <motion.div
          aria-hidden="true"
          initial={prefersReducedMotion ? false : { opacity: 0, scaleX: 0.92 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.45, delay: prefersReducedMotion ? 0 : 0.12, ease: [0.16, 1, 0.3, 1] }}
          className="my-8 sm:my-10 h-px w-full max-w-2xl bg-neutral-800"
        />

        {/* Three Equally Distributed Trust Indicators */}
        <ul className="grid grid-cols-3 gap-2 min-[375px]:gap-4 sm:gap-8 w-full max-w-2xl">
          {TRUST_INDICATORS.map(({ id, label, Icon }, index) => (
            <motion.li
              key={id}
              initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.4,
                delay: prefersReducedMotion ? 0 : 0.2 + index * 0.1,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="flex flex-col items-center justify-start gap-2.5 sm:gap-3 px-1"
            >
              <Icon
                aria-hidden="true"
                strokeWidth={1.75}
                className="w-6 h-6 sm:w-7 sm:h-7 text-[#F99B00] shrink-0"
              />
              <span className="text-[10px] min-[375px]:text-xs sm:text-sm font-bold tracking-[0.06em] min-[375px]:tracking-[0.12em] uppercase text-white leading-tight whitespace-nowrap">
                {label}
              </span>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
};
