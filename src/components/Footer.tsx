import React from 'react';
import { HERO_COPY } from '../data/categories';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-black text-white pt-10 sm:pt-12 pb-[calc(6.25rem+env(safe-area-inset-bottom))] md:pb-12 pl-[max(1.25rem,env(safe-area-inset-left))] pr-[max(1.25rem,env(safe-area-inset-right))] sm:px-10 md:pr-24 xl:px-12 border-t border-black/10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
        {/* Brand identity */}
        <div className="flex flex-col items-center md:items-start">
          <a
            href="https://novaviseu.com.br/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Nova Viseu Autopeças"
            className="inline-flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded"
          >
            <img
              src={HERO_COPY.brandLogo}
              onError={(e) => {
                const target = e.currentTarget;
                if (target.src !== HERO_COPY.cloudinaryLogo) {
                  target.src = HERO_COPY.cloudinaryLogo;
                }
              }}
              alt="Nova Viseu Autopeças"
              loading="lazy"
              decoding="async"
              className="h-8 sm:h-9 md:h-10 w-auto object-contain brightness-0 invert"
            />
          </a>
          <p className="text-xs sm:text-sm md:text-xs text-neutral-300 mt-3 max-w-sm leading-relaxed">
            Peças automotivas originais com garantia de procedência e qualidade para o seu veículo.
          </p>
        </div>

        {/* Links & Copyright */}
        <div className="flex flex-col items-center md:items-end gap-2 text-xs text-neutral-300">
          <nav aria-label="Links institucionais" className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 sm:gap-x-4">
            <a
              href="https://novaviseu.com.br/"
              target="_blank"
              rel="noopener noreferrer"
              className="min-h-[44px] sm:min-h-0 inline-flex items-center px-1.5 sm:px-0 text-white hover:text-[#F99B00] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded"
            >
              Loja Oficial
            </a>
            <span aria-hidden="true" className="text-neutral-600">•</span>
            <a
              href="https://novaviseu.com.br/contato"
              target="_blank"
              rel="noopener noreferrer"
              className="min-h-[44px] sm:min-h-0 inline-flex items-center px-1.5 sm:px-0 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded"
            >
              Atendimento
            </a>
            <span aria-hidden="true" className="text-neutral-600">•</span>
            <a
              href="https://novaviseu.com.br/politica-de-privacidade"
              target="_blank"
              rel="noopener noreferrer"
              className="min-h-[44px] sm:min-h-0 inline-flex items-center px-1.5 sm:px-0 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded"
            >
              Privacidade
            </a>
          </nav>
          <p className="mt-0.5 text-neutral-300">
            © {new Date().getFullYear()} NOVA VISEU AUTOPEÇAS. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};
