import brandLogoWebp from '../assets/images/logo_nova_viseu_official.webp';
import partMotorWebp from '../assets/images/part_motor_transparent.webp';
import partFarolWebp from '../assets/images/part_farol_transparent.webp';
import partCambioWebp from '../assets/images/part_cambio_transparent.webp';
import partAlternadorWebp from '../assets/images/part_alternador_transparent.webp';
import partDifusorWebp from '../assets/images/part_difusor_transparent.webp';
import partRodaWebp from '../assets/images/part_roda_transparent.webp';
import vehicleBlackCompleteWebp from '../assets/images/vehicle_black_complete.webp';
import vehicleBlackXrayWebp from '../assets/images/vehicle_black_xray.webp';
import vehicleBlackDisassembledWebp from '../assets/images/vehicle_black_disassembled.webp';
import brandFiatTransparentPng from '../assets/images/brand_fiat_transparent.png';
import brandHondaTransparentPng from '../assets/images/brand_honda_transparent.png';

export interface CategoryItem {
  id: string;
  name: string;
  order: number;
  row: 1 | 2;
  col: 1 | 2 | 3;
  image: string;
  url: string;
  // Physical origin inside vehicle chassis (relative % of car dimension from center)
  chassisOrigin: {
    x: number;
    y: number;
    rotate: number;
  };
  // Intermediate extraction position (Step 3 & 4)
  extractedPos: {
    x: number;
    y: number;
    rotate: number;
  };
  // Orbital paths around vehicle (Step 5)
  orbitPoint1: {
    x: number;
    y: number;
    scale: number;
    rotate: number;
  };
  orbitPoint2: {
    x: number;
    y: number;
    scale: number;
    rotate: number;
  };
  // Calibrated max-width / max-height % inside the card image container for safe padding
  cardFit: number;
}

export const CATEGORIES: CategoryItem[] = [
  // ROW 1 (Desktop) / ROW 1 (Mobile)
  {
    id: 'motor',
    name: 'Motor',
    order: 1,
    row: 1,
    col: 1,
    image: partMotorWebp,
    url: 'https://novaviseu.com.br/produtos/motor-parcial',
    chassisOrigin: { x: -33, y: -2, rotate: -4 },
    extractedPos: { x: -44, y: -28, rotate: -8 },
    orbitPoint1: { x: -38, y: -34, scale: 0.9, rotate: -14 },
    orbitPoint2: { x: -34, y: -22, scale: 0.95, rotate: -4 },
    cardFit: 88
  },
  {
    id: 'farol',
    name: 'Farol',
    order: 2,
    row: 1,
    col: 2,
    image: partFarolWebp,
    url: 'https://novaviseu.com.br/produtos/farol',
    chassisOrigin: { x: -45, y: -14, rotate: 12 },
    extractedPos: { x: -35, y: -32, rotate: 16 },
    orbitPoint1: { x: -12, y: -36, scale: 0.88, rotate: 12 },
    orbitPoint2: { x: 4, y: -24, scale: 0.92, rotate: 4 },
    cardFit: 86
  },
  {
    id: 'cambio',
    name: 'Câmbio',
    order: 3,
    row: 1,
    col: 3,
    image: partCambioWebp,
    url: 'https://novaviseu.com.br/produtos/cambio-caixa-marcha',
    chassisOrigin: { x: -9, y: 0, rotate: -6 },
    extractedPos: { x: 14, y: -24, rotate: -10 },
    orbitPoint1: { x: 34, y: -30, scale: 0.9, rotate: -12 },
    orbitPoint2: { x: 38, y: -16, scale: 0.92, rotate: -6 },
    cardFit: 86
  },
  // ROW 2 (Desktop)
  {
    id: 'alternador',
    name: 'Alternador',
    order: 4,
    row: 2,
    col: 1,
    image: partAlternadorWebp,
    url: 'https://novaviseu.com.br/produtos/alternadores',
    chassisOrigin: { x: -34, y: 12, rotate: 15 },
    extractedPos: { x: -42, y: 26, rotate: 12 },
    orbitPoint1: { x: -38, y: 32, scale: 0.88, rotate: 10 },
    orbitPoint2: { x: -34, y: 22, scale: 0.92, rotate: 2 },
    cardFit: 82
  },
  {
    id: 'difusor-de-ar',
    name: 'Difusor de ar',
    order: 5,
    row: 2,
    col: 2,
    image: partDifusorWebp,
    url: 'https://novaviseu.com.br/produtos/difusor-ar',
    chassisOrigin: { x: -7, y: -5, rotate: -5 },
    extractedPos: { x: 0, y: 24, rotate: -6 },
    orbitPoint1: { x: 6, y: 34, scale: 0.85, rotate: -8 },
    orbitPoint2: { x: 0, y: 22, scale: 0.9, rotate: 0 },
    cardFit: 80
  },
  {
    id: 'roda',
    name: 'Roda',
    order: 6,
    row: 2,
    col: 3,
    image: partRodaWebp,
    url: 'https://novaviseu.com.br/produtos/roda',
    chassisOrigin: { x: 29, y: 13, rotate: 20 },
    extractedPos: { x: 42, y: 26, rotate: 26 },
    orbitPoint1: { x: 40, y: 32, scale: 0.92, rotate: 36 },
    orbitPoint2: { x: 34, y: 22, scale: 0.94, rotate: 12 },
    cardFit: 86
  }
];

export const HERO_COPY = {
  brandName: 'NOVA VISEU AUTOPEÇAS',
  brandLogo: brandLogoWebp,
  cloudinaryLogo: 'https://res.cloudinary.com/zxzce8gr/image/upload/v1793707596/hviujc1qdjbh3cr2vcme.png',
  headlineLine1: 'A PEÇA CERTA',
  headlineLine2Prefix: 'PARA O SEU ',
  headlineLine2Highlight: 'CARRO',
  subparagraph: 'Encontre a peça que você precisa para o seu veículo. Consulte nossa equipe e confira as opções disponíveis.',
  finalHeadlineLine1: 'ENCONTRE A PEÇA',
  finalHeadlineLine2: 'QUE VOCÊ PRECISA',
  buttonLabel: 'Site Oficial',
  buttonUrl: 'https://novaviseu.com.br/',
  whatsappUrl:
    'https://wa.me/5521999643392?text=Ol%C3%A1!%20Gostaria%20de%20consultar%20a%20disponibilidade%20de%20uma%20pe%C3%A7a%20espec%C3%ADfica%20para%20o%20meu%20ve%C3%ADculo.',
  carImage: vehicleBlackCompleteWebp,
  carXrayImage: vehicleBlackXrayWebp,
  carBlackComplete: vehicleBlackCompleteWebp,
  carBlackXray: vehicleBlackXrayWebp,
  carBlackDisassembled: vehicleBlackDisassembledWebp,
  carSilverComplete: vehicleBlackCompleteWebp,
  carSilverXray: vehicleBlackXrayWebp,
  carSilverDisassembled: vehicleBlackDisassembledWebp
};

export interface BrandItem {
  id: 'chevrolet' | 'fiat' | 'volkswagen' | 'honda';
  name: string;
  image: string;
  url: string;
  opticalWidthPct: number;
  opticalHeightPct: number;
}

export const BRANDS: BrandItem[] = [
  {
    id: 'chevrolet',
    name: 'Chevrolet',
    image: '/assets/aistudio/image_ebf9ace0.png',
    url: 'https://novaviseu.com.br/busca?brand=Chevrolet',
    opticalWidthPct: 92,
    opticalHeightPct: 86,
  },
  {
    id: 'fiat',
    name: 'Fiat',
    image: brandFiatTransparentPng,
    url: 'https://novaviseu.com.br/busca?brand=Fiat',
    opticalWidthPct: 68,
    opticalHeightPct: 64,
  },
  {
    id: 'volkswagen',
    name: 'Volkswagen',
    image: '/assets/aistudio/image_8490ebb4.png',
    url: 'https://novaviseu.com.br/busca?brand=Volkswagen',
    opticalWidthPct: 82,
    opticalHeightPct: 88,
  },
  {
    id: 'honda',
    name: 'Honda',
    image: brandHondaTransparentPng,
    url: 'https://novaviseu.com.br/busca?brand=Honda',
    opticalWidthPct: 82,
    opticalHeightPct: 86,
  },
];
