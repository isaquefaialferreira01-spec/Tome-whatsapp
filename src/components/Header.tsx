import React, { useEffect, useState } from 'react';
import { HERO_COPY } from '../data/categories';
import { FloatingNavbar } from './ui/floating-navbar';
import { cn } from '@/lib/utils';

export const Header: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const brand = (
    <a
      href={HERO_COPY.buttonUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black dark:focus-visible:ring-white rounded"
      aria-label="Nova Viseu Autopeças - Página Inicial"
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
        loading="eager"
        fetchPriority="high"
        decoding="sync"
        className={cn(
          'h-7 min-[375px]:h-8 sm:h-9 w-auto object-contain transition-all duration-300 hover:opacity-90',
          scrolled && 'dark:brightness-0 dark:invert'
        )}
      />
    </a>
  );

  const links = [
    { label: 'WhatsApp', href: 'https://wa.me/message/253233ICLJKKM1' },
  ];

  return (
    <FloatingNavbar
      brand={brand}
      links={links}
      cta={{ label: HERO_COPY.buttonLabel, href: HERO_COPY.buttonUrl }}
      className={cn(
        'pl-[max(0.75rem,env(safe-area-inset-left))] pr-[max(0.75rem,env(safe-area-inset-right))] sm:px-6 [&>nav]:px-4 sm:[&>nav]:px-6 [&>nav]:gap-3 sm:[&>nav]:gap-5 [&_a]:whitespace-nowrap',
        scrolled
          ? 'pt-[max(0.75rem,env(safe-area-inset-top))]'
          : 'pt-[max(0px,env(safe-area-inset-top))] [&_nav>div>a]:text-black/85 [&_nav>div>a:hover]:text-black'
      )}
    />
  );
};
