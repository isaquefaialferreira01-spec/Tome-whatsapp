import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Headset, MessageCircle, ArrowRight } from "lucide-react";
import { ShinyButton } from "./ui/shiny-button";

const OFFICIAL_ASSISTANCE_URL = "https://lp.novaviseu.com.br/";

export const CustomerAssistanceSection: React.FC = () => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section
      id="atendimento-peca"
      aria-labelledby="atendimento-peca-heading"
      className="relative z-20 w-full bg-[#F99B00] text-black py-12 sm:py-16 md:py-20 px-4 sm:px-8 lg:px-12"
    >
      <div className="max-w-3xl mx-auto w-full flex flex-col items-center text-center">
        {/* 1. Main Icon */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="mb-4 sm:mb-5 text-black"
        >
          <Headset
            aria-hidden="true"
            strokeWidth={1.85}
            className="w-10 h-10 sm:w-12 sm:h-12 text-black"
          />
        </motion.div>

        {/* 2. Main Headline */}
        <motion.h2
          id="atendimento-peca-heading"
          initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{
            duration: 0.45,
            delay: prefersReducedMotion ? 0 : 0.08,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="font-display text-3xl min-[375px]:text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-normal leading-[1.02] text-black"
        >
          NÃO ENCONTROU A PEÇA?
        </motion.h2>

        {/* 3. Supporting Text */}
        <motion.p
          initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{
            duration: 0.45,
            delay: prefersReducedMotion ? 0 : 0.16,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="mt-3 sm:mt-4 max-w-xl text-sm min-[375px]:text-base sm:text-lg md:text-xl font-medium text-black leading-relaxed"
        >
          Nossa equipe te ajuda a encontrar a peça certa para o seu veículo.
        </motion.p>

        {/* 4. Animated CTA Button */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{
            duration: 0.45,
            delay: prefersReducedMotion ? 0 : 0.24,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="mt-6 sm:mt-8 w-full flex justify-center"
        >
          <ShinyButton
            className="rounded-full! bg-black! px-6! min-[375px]:px-7! py-4! text-sm! min-[375px]:text-base! text-white! shadow-none! cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 focus-visible:ring-offset-[#F99B00]"
            onClick={() => window.location.assign(OFFICIAL_ASSISTANCE_URL)}
          >
            <span className="flex items-center justify-center gap-2.5 min-[375px]:gap-3 text-white whitespace-nowrap">
              <MessageCircle aria-hidden="true" className="h-4 w-4 min-[375px]:h-5 min-[375px]:w-5 text-white shrink-0" />
              <span>Fale com um vendedor</span>
              <ArrowRight aria-hidden="true" className="h-4 w-4 min-[375px]:h-5 min-[375px]:w-5 text-white shrink-0" />
            </span>
          </ShinyButton>
        </motion.div>
      </div>
    </section>
  );
};
