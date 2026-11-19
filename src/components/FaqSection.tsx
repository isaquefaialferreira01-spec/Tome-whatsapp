import React, { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronDown } from "lucide-react";

interface FaqItem {
  id: string;
  category: string;
  question: string;
  answer: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    id: "compatibilidade-veiculo",
    category: "Compatibilidade",
    question: "Como saber se a peça é compatível com o meu veículo?",
    answer:
      "Você pode conferir o código original da peça (referência OEM) e os dados do seu veículo — marca, modelo, ano e motorização — diretamente na página do produto na loja oficial. Caso tenha qualquer dúvida antes de comprar, nossa equipe de vendedores ajuda a validar a aplicação correta pelo atendimento online.",
  },
  {
    id: "garantia-procedencia",
    category: "Garantia",
    question: "As peças possuem garantia, procedência e nota fiscal?",
    answer:
      "Sim. Todas as peças do nosso catálogo são originais e catalogadas com procedência garantida, emissão de nota fiscal e cobertura de garantia conforme as especificações de cada item e a legislação vigente.",
  },
  {
    id: "envio-prazos-frete",
    category: "Envio",
    question: "Como funcionam o envio, o cálculo de frete e os prazos de entrega?",
    answer:
      "Realizamos envios para todo o Brasil. O valor do frete e o prazo estimado variam de acordo com o CEP de destino, dimensões e peso da peça — desde componentes elétricos compactos até motores parciais e caixas de câmbio — e podem ser consultados no site oficial ou com um de nossos vendedores.",
  },
  {
    id: "acionar-garantia-troca",
    category: "Garantia",
    question: "Como funciona o atendimento em caso de garantia ou troca?",
    answer:
      "Se houver necessidade de garantia ou troca, basta entrar em contato pelos canais oficiais da Nova Viseu Autopeças informando o número do pedido e a nota fiscal. Nossa equipe orienta todo o procedimento de análise e atendimento de forma ágil.",
  },
  {
    id: "marcas-categorias-catalogo",
    category: "Catálogo",
    question: "Quais marcas e categorias de peças vocês atendem?",
    answer:
      "Contamos com mais de 80.000 peças em catálogo, incluindo itens como motor parcial, farol, câmbio, alternador, difusor de ar, roda e diversos outros componentes para montadoras como Chevrolet, Fiat, Volkswagen, Honda e outras linhas automotivas.",
  },
  {
    id: "confirmar-disponibilidade",
    category: "Atendimento",
    question: "Posso confirmar detalhes da peça antes de finalizar a compra?",
    answer:
      "Sim. Se não encontrar a peça desejada ou quiser confirmar detalhes técnicos e disponibilidade antes do fechamento do pedido, clique em “Fale com um vendedor” ou acesse nossa loja oficial para receber suporte especializado.",
  },
];

export const FaqSection: React.FC = () => {
  const [openId, setOpenId] = useState<string | null>(null);
  const prefersReducedMotion = useReducedMotion();

  const toggleItem = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section
      id="perguntas-frequentes"
      aria-labelledby="faq-heading"
      className="relative z-20 w-full bg-black text-white border-b border-neutral-800 py-12 sm:py-16 md:py-20 px-4 sm:px-8 lg:px-12"
    >
      <div className="max-w-3xl mx-auto w-full">
        {/* Section Header */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-8 sm:mb-10"
        >
          <h2
            id="faq-heading"
            className="font-display text-3xl min-[375px]:text-4xl sm:text-5xl font-black uppercase tracking-normal leading-none"
          >
            <span className="text-white">PERGUNTAS </span>
            <span className="text-[#F99B00]">FREQUENTES</span>
          </h2>
          <p className="mt-2.5 sm:mt-3 text-sm min-[375px]:text-base text-neutral-300 font-normal leading-relaxed max-w-xl mx-auto">
            Tire suas dúvidas sobre envio, garantia, procedência e compatibilidade das peças.
          </p>
        </motion.div>

        {/* Clean Accordion List */}
        <div className="divide-y divide-neutral-800 border-y border-neutral-800">
          {FAQ_ITEMS.map((item) => {
            const isOpen = openId === item.id;
            const buttonId = `faq-btn-${item.id}`;
            const panelId = `faq-panel-${item.id}`;

            return (
              <div key={item.id} className="w-full">
                <h3>
                  <button
                    id={buttonId}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => toggleItem(item.id)}
                    className="group w-full flex items-center justify-between gap-4 py-4 sm:py-5 text-left cursor-pointer touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F99B00] focus-visible:ring-inset rounded-sm"
                  >
                    <span className="text-sm min-[375px]:text-base sm:text-lg font-semibold text-white group-hover:text-[#F99B00] transition-colors leading-snug">
                      {item.question}
                    </span>
                    <ChevronDown
                      aria-hidden="true"
                      className={`w-5 h-5 shrink-0 text-[#F99B00] transition-transform duration-300 ${
                        isOpen ? "rotate-180" : "rotate-0"
                      }`}
                    />
                  </button>
                </h3>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={panelId}
                      role="region"
                      aria-labelledby={buttonId}
                      initial={
                        prefersReducedMotion
                          ? { opacity: 1 }
                          : { height: 0, opacity: 0 }
                      }
                      animate={
                        prefersReducedMotion
                          ? { opacity: 1 }
                          : { height: "auto", opacity: 1 }
                      }
                      exit={
                        prefersReducedMotion
                          ? { opacity: 0 }
                          : { height: 0, opacity: 0 }
                      }
                      transition={{
                        duration: prefersReducedMotion ? 0 : 0.28,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      className="overflow-hidden"
                    >
                      <p className="pb-5 pr-6 text-xs min-[375px]:text-sm sm:text-base text-neutral-300 leading-relaxed">
                        {item.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
