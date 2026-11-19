import React from 'react';
import { Header } from './components/Header';
import { HeroAnimationStage } from './components/HeroAnimationStage';
import { BrandsSection } from './components/BrandsSection';
import { AuthoritySection } from './components/AuthoritySection';
import { CustomerAssistanceSection } from './components/CustomerAssistanceSection';
import { FaqSection } from './components/FaqSection';
import { Footer } from './components/Footer';
import { WhatsappFloat } from './components/ui/whatsapp-float';

export default function App() {
  return (
    <div className="min-h-screen min-h-[100dvh] bg-[#F99B00] relative selection:bg-black selection:text-white flex flex-col">
      {/* Fixed Header with Official Logo and 'Site Oficial' button */}
      <Header />

      {/* Pinned Scroll-Driven Transformation Stage */}
      <main className="flex-1">
        <HeroAnimationStage />
        <BrandsSection />
        <AuthoritySection />
        <CustomerAssistanceSection />
        <FaqSection />
      </main>

      {/* Clean compact website footer */}
      <Footer />

      {/* Floating WhatsApp sales widget */}
      <WhatsappFloat
        phone="21999643392"
        message="Olá! Vim pelo site e gostaria de consultar uma peça."
      />
    </div>
  );
}
