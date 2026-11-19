import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { BRANDS } from '../data/categories';

export const BrandsSection: React.FC = () => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section
      id="nossas-marcas"
      aria-labelledby="nossas-marcas-heading"
      className={`relative z-20 w-full bg-[#F99B00] p-6 sm:px-8 lg:px-12 ${
        prefersReducedMotion
          ? 'pt-2 mt-0'
          : 'pt-0 -mt-8 [@media(max-width:767px)_and_(min-height:780px)]:-mt-24 [@media(min-width:768px)_and_(max-width:1023px)_and_(min-height:900px)]:-mt-28 [@media(min-width:768px)_and_(max-height:899px)]:-mt-7 [@media(min-width:1024px)_and_(min-height:840px)]:-mt-10'
      }`}
    >
      {/* Smooth #F99B00 top transition blending seamlessly from the pinned stage */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-8 inset-x-0 h-8 bg-gradient-to-b from-transparent to-[#F99B00]"
      />

      <div className="max-w-6xl mx-auto w-full">
        {/* Section Title + Subtitle */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-3 sm:mb-4 lg:mb-5"
        >
          <h2
            id="nossas-marcas-heading"
            className="font-display text-3xl min-[375px]:text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-normal leading-none drop-shadow-sm"
          >
            <span className="text-black">NOSSAS </span>
            <span className="text-white drop-shadow-md">MARCAS</span>
          </h2>
          <p className="mt-1 sm:mt-1.5 mx-auto max-w-xl text-center text-sm min-[375px]:text-base sm:text-lg md:text-xl font-medium text-black leading-snug">
            Clique no botão abaixo e veja as peças da sua marca.
          </p>
        </motion.div>

        {/* Responsive Grid: Mobile 2x2 | Desktop 4x1 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 min-[375px]:gap-4 sm:gap-5 lg:gap-6 w-full">
          {BRANDS.map((brand, index) => (
            <motion.div
              key={brand.id}
              initial={prefersReducedMotion ? false : { opacity: 0, y: 24, scale: 0.96 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{
                duration: 0.45,
                delay: prefersReducedMotion ? 0 : index * 0.08,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="w-full"
            >
              <a
                href={brand.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Ver peças ${brand.name} na Nova Viseu Autopeças`}
                className="group relative flex items-center justify-center bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 shadow-lg shadow-black/8 hover:shadow-2xl hover:shadow-black/20 hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 ease-out border border-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black w-full h-[116px] min-[375px]:h-[132px] sm:h-[156px] md:h-[152px] lg:h-[176px] cursor-pointer overflow-hidden touch-manipulation"
              >
                <img
                  src={brand.image}
                  alt={brand.name}
                  referrerPolicy="no-referrer"
                  loading="lazy"
                  decoding="async"
                  style={{
                    maxWidth: `${brand.opticalWidthPct}%`,
                    maxHeight: `${brand.opticalHeightPct}%`,
                  }}
                  className="w-auto h-auto object-contain transition-transform duration-300 ease-out group-hover:scale-105"
                />
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
