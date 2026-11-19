import React, { useRef, useLayoutEffect, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CATEGORIES, HERO_COPY } from '../data/categories';
import { CategoryCard } from './CategoryCard';
import { WordRotate } from './ui/word-rotate';
import { DotWave } from './ui/dot-wave';

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });

const HERO_ROTATING_WORDS = [
  'CARRO',
  'ONIX',
  'CRONOS',
  'ARGO',
  'HB20',
  'CRETA',
  'FIT',
  'CITY',
  'CIVIC',
  'SPIN',
  'COBALT',
  'IX35',
  'SENTRA',
];

export const HeroAnimationStage: React.FC = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
  const containerRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const heroTextRef = useRef<HTMLDivElement>(null);
  const carWrapperRef = useRef<HTMLDivElement>(null);
  const carState1Ref = useRef<HTMLImageElement>(null);
  const carState2Ref = useRef<HTMLImageElement>(null);
  const carState3Ref = useRef<HTMLImageElement>(null);
  const carShadowRef = useRef<HTMLDivElement>(null);
  const xrayGlowRef = useRef<HTMLDivElement>(null);
  const finalTitleRef = useRef<HTMLDivElement>(null);
  const cardsGridRef = useRef<HTMLDivElement>(null);
  const cardElementsRef = useRef<(HTMLDivElement | null)[]>([]);
  const cardImageRefs = useRef<(HTMLImageElement | null)[]>([]);
  const partElementsRef = useRef<(HTMLDivElement | null)[]>([]);
  const partImageRefs = useRef<(HTMLImageElement | null)[]>([]);

  useEffect(() => {
    const refreshScroll = () => ScrollTrigger.refresh();
    const timer = setTimeout(refreshScroll, 300);
    window.addEventListener('load', refreshScroll);
    const imgs = cardImageRefs.current.filter((img): img is HTMLImageElement => Boolean(img));
    imgs.forEach((img) => {
      if (!img.complete) img.addEventListener('load', refreshScroll, { once: true });
    });
    return () => {
      clearTimeout(timer);
      window.removeEventListener('load', refreshScroll);
      imgs.forEach((img) => img.removeEventListener('load', refreshScroll));
    };
  }, []);

  useLayoutEffect(() => {
    const mm = gsap.matchMedia();

    // Debounced refresh on device rotation or significant width shifts (ignoring mobile URL-bar height micro-changes)
    let lastWidth = window.innerWidth;
    let resizeTimer: ReturnType<typeof setTimeout> | undefined;
    const handleResize = () => {
      const nextWidth = window.innerWidth;
      if (Math.abs(nextWidth - lastWidth) > 12) {
        lastWidth = nextWidth;
        if (resizeTimer) clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => ScrollTrigger.refresh(), 160);
      }
    };
    const handleOrientation = () => {
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => ScrollTrigger.refresh(), 220);
    };
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleOrientation);

    // 1. REDUCED MOTION ALTERNATIVE: Immediate interactive access to all 6 categories without scroll-jacking
    mm.add('(prefers-reduced-motion: reduce)', () => {
      if (heroTextRef.current) gsap.set(heroTextRef.current, { opacity: 0, display: 'none' });
      if (carWrapperRef.current) gsap.set(carWrapperRef.current, { opacity: 0, display: 'none' });
      partElementsRef.current.forEach((el) => el && gsap.set(el, { autoAlpha: 0, display: 'none' }));
      cardImageRefs.current.forEach((el) => el && gsap.set(el, { opacity: 1 }));
      if (finalTitleRef.current) gsap.set(finalTitleRef.current, { opacity: 1, y: 0 });
      if (cardsGridRef.current) gsap.set(cardsGridRef.current, { opacity: 1, scale: 1, pointerEvents: 'auto' });
    });

    const buildResponsiveTimeline = (isMobile: boolean) => {
      const getDims = () => {
        const w = viewportRef.current?.clientWidth || window.innerWidth;
        const h = viewportRef.current?.clientHeight || window.innerHeight;
        return { width: w, height: h, isMobile, isLandscape: w > h && h < 520 };
      };

      // Sub-pixel landing coordinates & exact scale matching each card's own inner image slot
      const getCardLandingTarget = (idx: number) => {
        const vpEl = viewportRef.current;
        const partEl = partElementsRef.current[idx];
        const cardImgEl = cardImageRefs.current[idx];
        const cardEl = cardElementsRef.current[idx];

        if (vpEl && partEl) {
          const vpRect = vpEl.getBoundingClientRect();
          const vpCenterX = vpRect.left + vpRect.width / 2;
          const vpCenterY = vpRect.top + vpRect.height / 2;
          const partBoxSize = partEl.offsetWidth || (isMobile ? 96 : 160);

          if (cardImgEl) {
            const imgRect = cardImgEl.getBoundingClientRect();
            if (imgRect.width > 4 && imgRect.height > 4) {
              const targetX = imgRect.left + imgRect.width / 2 - vpCenterX;
              const targetY = imgRect.top + imgRect.height / 2 - vpCenterY;
              const renderedMax = Math.max(imgRect.width, imgRect.height);
              const exactScale = renderedMax / partBoxSize;
              return { x: targetX, y: targetY, scale: exactScale };
            }
          }

          if (cardEl) {
            const cardRect = cardEl.getBoundingClientRect();
            const fitFactor = CATEGORIES[idx].cardFit / 100;
            const slotW = cardRect.width * 0.72 * fitFactor;
            const slotH = cardRect.height * 0.62 * fitFactor;
            const fallbackScale = Math.min(slotW, slotH) / partBoxSize;
            return {
              x: cardRect.left + cardRect.width / 2 - vpCenterX,
              y: cardRect.top + cardRect.height * 0.42 - vpCenterY,
              scale: fallbackScale
            };
          }
        }

        const { width, height, isLandscape } = getDims();
        const cols = isMobile && !isLandscape ? 2 : 3;
        const col = idx % cols;
        const row = Math.floor(idx / cols);
        const colSpacing = cols === 2 ? width * 0.24 : isMobile ? width * 0.30 : Math.min(width * 0.30, 360);
        const rowSpacing = cols === 2 ? Math.min(height * 0.20, 165) : Math.min(height * 0.24, 200);
        return {
          x: cols === 2 ? (col === 0 ? -colSpacing : colSpacing) : (col - 1) * colSpacing,
          y: cols === 2 ? (row - 1) * rowSpacing : row === 0 ? -rowSpacing * 0.5 : rowSpacing * 0.8,
          scale: isMobile ? 0.54 : 0.72
        };
      };

      const { width, height, isLandscape } = getDims();

      // Calculate Drive Parts-style opening vehicle entrance:
      // Rises zoomed from lower viewport with front hood subtly meeting bottom edge of hero headline
      const getOpeningVehicleTransform = () => {
        const w = viewportRef.current?.clientWidth || window.innerWidth;
        const h = viewportRef.current?.clientHeight || window.innerHeight;
        const landscape = w > h && h < 520;
        const carBox = carWrapperRef.current?.firstElementChild as HTMLElement | null;
        const h1El = heroTextRef.current?.querySelector('h1');
        const baseH = carBox?.offsetHeight || (isMobile ? Math.min(h * 0.48, 420) : Math.min(h * 0.62, 580));
        const baseW = carBox?.offsetWidth || baseH * (848 / 1264);

        const openScale = isMobile
          ? landscape
            ? Math.min(1.12, Math.max(0.9, (h * 0.58) / baseH))
            : Math.min(1.18, Math.max(1.0, (w * 0.76) / baseW))
          : Math.min(2.1, Math.max(1.55, (w * 0.44) / baseW));

        if (h1El && viewportRef.current) {
          const vpRect = viewportRef.current.getBoundingClientRect();
          const h1Rect = h1El.getBoundingClientRect();
          const h1FontSize = parseFloat(getComputedStyle(h1El).fontSize) || (isMobile ? 40 : 112);
          const overlapPx = isMobile ? -Math.max(4, h1FontSize * 0.1) : h1FontSize * 0.14;
          const desiredHoodTop = h1Rect.bottom - overlapPx;
          const restCenterY = vpRect.top + vpRect.height / 2;
          const scaledHalfH = (baseH * openScale) / 2;
          const targetCenterY = desiredHoodTop + scaledHalfH * 0.952;
          return {
            scale: openScale,
            y: targetCenterY - restCenterY
          };
        }

        return {
          scale: openScale,
          y: isMobile ? (landscape ? h * 0.18 : h * 0.14) : h * 0.34
        };
      };

      // Set Initial Visual States
      const initOpening = getOpeningVehicleTransform();
      gsap.set(heroTextRef.current, { opacity: 1, y: 0, scale: 1, display: 'flex' });
      gsap.set(carWrapperRef.current, { opacity: 1, scale: initOpening.scale, y: initOpening.y, rotation: 0, display: 'flex' });
      gsap.set(carState1Ref.current, { opacity: 1 });
      gsap.set(carState2Ref.current, { opacity: 0, '--xray-wipe': '-12%' } as gsap.TweenVars);
      gsap.set(carState3Ref.current, { opacity: 0 });
      gsap.set(xrayGlowRef.current, { opacity: 0 });
      gsap.set(carShadowRef.current, { opacity: 1 });
      gsap.set(finalTitleRef.current, { opacity: 0, y: 32 });
      // Keep cardsGridRef at scale: 1 so cardImageRefs getBoundingClientRect() measures exact final pixels
      gsap.set(cardsGridRef.current, { opacity: 0, scale: 1, pointerEvents: 'none' });
      cardImageRefs.current.forEach((imgEl) => {
        if (imgEl) gsap.set(imgEl, { opacity: 0 });
      });

      const carBoxEl = carWrapperRef.current?.firstElementChild as HTMLElement | null;
      const carHeight = carBoxEl?.offsetHeight || (isMobile ? Math.min(height * 0.48, 420) : Math.min(height * 0.62, 580));
      const carWidth = carBoxEl?.offsetWidth || carHeight * (848 / 1264);
      const partBasePx = partElementsRef.current[0]?.offsetWidth || (isMobile ? 96 : 192);

      // Mobile viewport boundary clamping so parts never get pushed off-screen on 320px–430px devices
      const clampX = (rawX: number, scale: number) => {
        if (!isMobile) return rawX;
        const margin = width <= 360 ? 8 : 12;
        const maxOffset = Math.max(40, width / 2 - (partBasePx * scale) / 2 - margin);
        return Math.max(-maxOffset, Math.min(maxOffset, rawX));
      };
      const clampY = (rawY: number, scale: number) => {
        if (!isMobile) return rawY;
        const halfPart = (partBasePx * scale) / 2;
        const topSafe = isLandscape ? 54 : 72;
        const bottomSafe = isLandscape ? 16 : 28;
        const minOffset = -(height / 2 - topSafe - halfPart);
        const maxOffset = height / 2 - bottomSafe - halfPart;
        return Math.max(minOffset, Math.min(maxOffset, rawY));
      };

      // STEP 1: PHYSICAL CHASSIS ORIGINS (calibrated to 848x1264 cutaway engine/cabin/wheel wells)
      const physicalChassisOrigins = [
        { x: 0,             y: -0.30 * carHeight, rot: 0 },   // 0. Motor (front engine bay)
        { x: -0.27 * carWidth, y: -0.38 * carHeight, rot: 8 },   // 1. Farol (front-left headlight)
        { x: 0,             y: -0.09 * carHeight, rot: 0 },   // 2. Câmbio (center transmission tunnel)
        { x: -0.15 * carWidth, y: -0.26 * carHeight, rot: -8 },  // 3. Alternador (front accessory belt side)
        { x: 0.10 * carWidth,  y: -0.19 * carHeight, rot: 0 },   // 4. Difusor de ar (dashboard center-right vent)
        { x: 0.34 * carWidth,  y: 0.29 * carHeight,  rot: 12 },  // 5. Roda (rear-right wheel arch)
      ];

      // STEP 2: EXTRACTION TRAJECTORIES (mobile-clamped on < 768px, exact desktop offsets on >= 768px)
      const mobileScaleExtract = width <= 360 ? 0.64 : isLandscape ? 0.60 : 0.70;
      const extractionOffsets = isMobile
        ? [
            { x: clampX(0, mobileScaleExtract),               y: clampY(-0.46 * carHeight, mobileScaleExtract), rot: -2,  scale: mobileScaleExtract },
            { x: clampX(-width * 0.30, mobileScaleExtract),   y: clampY(-0.34 * carHeight, mobileScaleExtract), rot: -10, scale: mobileScaleExtract * 0.95 },
            { x: clampX(width * 0.31, mobileScaleExtract),    y: clampY(0.04 * carHeight, mobileScaleExtract),  rot: 8,   scale: mobileScaleExtract * 0.98 },
            { x: clampX(-width * 0.31, mobileScaleExtract),   y: clampY(0.04 * carHeight, mobileScaleExtract),  rot: -8,  scale: mobileScaleExtract * 0.95 },
            { x: clampX(width * 0.30, mobileScaleExtract),    y: clampY(-0.22 * carHeight, mobileScaleExtract), rot: 6,   scale: mobileScaleExtract * 0.92 },
            { x: clampX(width * 0.28, mobileScaleExtract),    y: clampY(0.36 * carHeight, mobileScaleExtract),  rot: 22,  scale: mobileScaleExtract },
          ]
        : [
            { x: 0,             y: -0.52 * carHeight, rot: -2,  scale: 0.86 },
            { x: -0.70 * carWidth, y: -0.40 * carHeight, rot: -10, scale: 0.82 },
            { x: 0.72 * carWidth,  y: 0.04 * carHeight,  rot: 8,   scale: 0.84 },
            { x: -0.72 * carWidth, y: 0.04 * carHeight,  rot: -8,  scale: 0.82 },
            { x: 0.70 * carWidth,  y: -0.24 * carHeight, rot: 6,   scale: 0.80 },
            { x: 0.64 * carWidth,  y: 0.40 * carHeight,  rot: 22,  scale: 0.86 },
          ];

      // STEP 3: SCENE 06 - EXACT DRIVE PARTS ORBIT POSITIONS AROUND CENTRAL VEHICLE
      const mobileScaleOrbit = width <= 360 ? 0.62 : isLandscape ? 0.58 : 0.68;
      const safeOrbitMaxX = Math.max(72, width / 2 - (partBasePx * mobileScaleOrbit) / 2 - (width <= 360 ? 8 : 12));
      const orbitRadiusX = isMobile
        ? Math.min(isLandscape ? width * 0.28 : width * 0.36, safeOrbitMaxX)
        : Math.min(width * 0.34, 410);
      const safeOrbitMaxY = Math.max(90, (height - (isLandscape ? 60 : 88)) / 2 - (partBasePx * mobileScaleOrbit) / 2);
      const orbitRadiusY = isMobile
        ? Math.min(isLandscape ? height * 0.34 : height * 0.31, safeOrbitMaxY)
        : Math.min(height * 0.34, 320);

      const scene06SurroundPositions = isMobile
        ? [
            { x: 0,                                                     y: clampY(orbitRadiusY * 0.96, mobileScaleOrbit),  rot: 0,  scale: mobileScaleOrbit },
            { x: clampX(-orbitRadiusX * 0.88, mobileScaleOrbit * 0.96), y: clampY(orbitRadiusY * 0.44, mobileScaleOrbit),  rot: 6,  scale: mobileScaleOrbit * 0.96 },
            { x: clampX(orbitRadiusX * 0.92, mobileScaleOrbit),         y: clampY(orbitRadiusY * 0.08, mobileScaleOrbit),  rot: -4, scale: mobileScaleOrbit },
            { x: clampX(-orbitRadiusX * 0.90, mobileScaleOrbit * 0.96), y: clampY(-orbitRadiusY * 0.14, mobileScaleOrbit), rot: 5,  scale: mobileScaleOrbit * 0.96 },
            { x: clampX(orbitRadiusX * 0.88, mobileScaleOrbit * 0.94),  y: clampY(-orbitRadiusY * 0.44, mobileScaleOrbit), rot: -5, scale: mobileScaleOrbit * 0.94 },
            { x: 0,                                                     y: clampY(-orbitRadiusY * 0.92, mobileScaleOrbit), rot: 0,  scale: mobileScaleOrbit * 1.02 },
          ]
        : [
            { x: 0,                    y: orbitRadiusY * 0.94,  rot: 0,  scale: 0.84 }, // 0. Motor (below car)
            { x: -orbitRadiusX * 0.84, y: orbitRadiusY * 0.44,  rot: 6,  scale: 0.80 }, // 1. Farol (lower-left)
            { x: orbitRadiusX * 0.90,  y: orbitRadiusY * 0.08,  rot: -4, scale: 0.82 }, // 2. Câmbio (right side)
            { x: -orbitRadiusX * 0.88, y: -orbitRadiusY * 0.14, rot: 5,  scale: 0.80 }, // 3. Alternador (left side)
            { x: orbitRadiusX * 0.86,  y: -orbitRadiusY * 0.44, rot: -5, scale: 0.78 }, // 4. Difusor de ar (upper-right)
            { x: 0,                    y: -orbitRadiusY * 0.94, rot: 0,  scale: 0.86 }, // 5. Roda (above car)
          ];

      // Initialize all isolated floating parts nested inside chassis
      partElementsRef.current.forEach((el, i) => {
        if (!el) return;
        const origin = physicalChassisOrigins[i];
        gsap.set(el, {
          x: origin.x,
          y: origin.y,
          scale: 0.14,
          rotation: origin.rot,
          autoAlpha: 0,
          display: 'flex',
          zIndex: 35
        });
      });

      partImageRefs.current.forEach((imgEl) => {
        if (imgEl) {
          gsap.set(imgEl, {
            filter: 'drop-shadow(0px 14px 24px rgba(0, 0, 0, 0.34))'
          });
        }
      });

      // =========================================================================
      // CONTINUOUS SCROLL-DRIVEN MASTER TIMELINE (GSAP + ScrollTrigger)
      // =========================================================================
      const masterTl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: isMobile ? 0.55 : 0.75,
          pin: viewportRef.current,
          anticipatePin: 1,
          invalidateOnRefresh: true
        }
      });

      // --- SCENE 01: OPENING VEHICLE RISES & CENTERS + HERO TITLE FADES (0% -> 20%) ---
      masterTl.fromTo(
        carWrapperRef.current,
        {
          y: () => getOpeningVehicleTransform().y,
          scale: () => getOpeningVehicleTransform().scale
        },
        {
          y: 0,
          scale: 1,
          duration: 18,
          ease: 'power2.inOut'
        },
        0
      );

      masterTl.to(
        heroTextRef.current,
        { opacity: 0, y: isMobile ? -44 : -70, scale: 0.95, duration: 12, ease: 'power2.inOut' },
        6
      );

      // --- SCENE 02: COMPLETE BLACK VEHICLE -> MATCHING X-RAY REVEAL (14% -> 25%) ---
      masterTl.to(
        carState1Ref.current,
        { opacity: 0, duration: 10, ease: 'power1.inOut' },
        14
      );

      masterTl.to(
        carState2Ref.current,
        { opacity: 1, duration: 10, ease: 'power1.inOut' },
        14
      );

      masterTl.to(
        xrayGlowRef.current,
        { opacity: 0.55, duration: 10, ease: 'power1.inOut' },
        15
      );

      // --- SCENE 03: ENGINE EXTRACTION FIRST (23% -> 35%) ---
      const motorEl = partElementsRef.current[0];
      if (motorEl) {
        masterTl.to(
          motorEl,
          {
            autoAlpha: 1,
            scale: extractionOffsets[0].scale,
            x: extractionOffsets[0].x,
            y: extractionOffsets[0].y,
            rotation: extractionOffsets[0].rot,
            duration: 13,
            ease: 'power2.out'
          },
          23
        );
      }

      // --- SCENE 04: HEADLIGHT EXTRACTION SECOND (30% -> 42%) ---
      const farolEl = partElementsRef.current[1];
      if (farolEl) {
        masterTl.to(
          farolEl,
          {
            autoAlpha: 1,
            scale: extractionOffsets[1].scale,
            x: extractionOffsets[1].x,
            y: extractionOffsets[1].y,
            rotation: extractionOffsets[1].rot,
            duration: 13,
            ease: 'power2.out'
          },
          30
        );
      }

      // --- SCENE 05: FURTHER EXTRACTIONS + X-RAY TO DISASSEMBLED CROSSFADE (36% -> 52%) ---
      [2, 3, 4, 5].forEach((i, stepIndex) => {
        const el = partElementsRef.current[i];
        if (!el) return;
        const target = extractionOffsets[i];
        masterTl.to(
          el,
          {
            autoAlpha: 1,
            scale: target.scale,
            x: target.x,
            y: target.y,
            rotation: target.rot,
            duration: 13,
            ease: 'power2.out'
          },
          36 + stepIndex * 3.2
        );
      });

      // State 2 (complete X-ray) reveals State 3 (disassembled chassis) smoothly from front bay to rear
      masterTl.set(carState3Ref.current, { opacity: 1 }, 24);
      masterTl.to(
        carState2Ref.current,
        { '--xray-wipe': '36%', duration: 9, ease: 'power1.inOut' } as gsap.TweenVars,
        26
      );
      masterTl.to(
        carState2Ref.current,
        { '--xray-wipe': '72%', duration: 9, ease: 'power1.inOut' } as gsap.TweenVars,
        35
      );
      masterTl.to(
        carState2Ref.current,
        { '--xray-wipe': '116%', duration: 8, ease: 'power1.inOut' } as gsap.TweenVars,
        44
      );

      // --- SCENE 06: SIX COMPONENTS ORBIT PERIMETER AROUND CENTRAL VEHICLE (52% -> 68%) ---
      const rawOuterSweepX = isMobile ? orbitRadiusX * 1.02 : orbitRadiusX * 1.24;
      const orbitPartFootprint = partBasePx * (isMobile ? mobileScaleOrbit : 0.86) * 1.22;
      const maxViewportPartX = Math.max(72, width / 2 - orbitPartFootprint / 2 - 14);
      const outerSweepX = Math.min(rawOuterSweepX, maxViewportPartX);
      const innerHoldX = isMobile ? orbitRadiusX * 0.64 : orbitRadiusX * 0.68;

      const scene06ArcKeyframes: gsap.TweenVars[][] = [
        // 0. Motor: top engine bay -> sweeps wide outside left lane -> settles BELOW car
        [
          { x: clampX(-orbitRadiusX * 0.78, scene06SurroundPositions[0].scale), y: clampY(-orbitRadiusY * 0.78, scene06SurroundPositions[0].scale), rotation: -6, scale: scene06SurroundPositions[0].scale, duration: 3.6, ease: 'sine.inOut' },
          { x: -outerSweepX,                                                   y: clampY(-orbitRadiusY * 0.04, scene06SurroundPositions[0].scale), rotation: -9, scale: scene06SurroundPositions[0].scale, duration: 4.4, ease: 'sine.inOut' },
          { x: clampX(-orbitRadiusX * 0.74, scene06SurroundPositions[0].scale), y: clampY(orbitRadiusY * 0.76, scene06SurroundPositions[0].scale),  rotation: -4, scale: scene06SurroundPositions[0].scale, duration: 3.8, ease: 'sine.inOut' },
          { x: scene06SurroundPositions[0].x, y: scene06SurroundPositions[0].y, rotation: scene06SurroundPositions[0].rot, scale: scene06SurroundPositions[0].scale, duration: 3.2, ease: 'power1.out' },
        ],
        // 1. Farol: upper-left -> holds inner lane while Motor sweeps outside -> settles LOWER-LEFT
        [
          { x: clampX(-innerHoldX, scene06SurroundPositions[1].scale), y: clampY(orbitRadiusY * 0.12, scene06SurroundPositions[1].scale), rotation: 2, scale: scene06SurroundPositions[1].scale, duration: 8.2, ease: 'sine.inOut' },
          { x: scene06SurroundPositions[1].x, y: scene06SurroundPositions[1].y, rotation: scene06SurroundPositions[1].rot, scale: scene06SurroundPositions[1].scale, duration: 6.8, ease: 'power1.out' },
        ],
        // 2. Câmbio: mid-right -> waits inner lane while Roda climbs outer lane -> settles RIGHT
        [
          { x: clampX(innerHoldX, scene06SurroundPositions[2].scale), y: clampY(orbitRadiusY * 0.06, scene06SurroundPositions[2].scale), rotation: -4, scale: scene06SurroundPositions[2].scale, duration: 8.0, ease: 'sine.inOut' },
          { x: scene06SurroundPositions[2].x, y: scene06SurroundPositions[2].y, rotation: scene06SurroundPositions[2].rot, scale: scene06SurroundPositions[2].scale, duration: 6.5, ease: 'power1.out' },
        ],
        // 3. Alternador: mid-left -> waits inner lane while Motor sweeps outside -> settles LEFT
        [
          { x: clampX(-innerHoldX, scene06SurroundPositions[3].scale), y: clampY(-orbitRadiusY * 0.10, scene06SurroundPositions[3].scale), rotation: 5, scale: scene06SurroundPositions[3].scale, duration: 8.0, ease: 'sine.inOut' },
          { x: scene06SurroundPositions[3].x, y: scene06SurroundPositions[3].y, rotation: scene06SurroundPositions[3].rot, scale: scene06SurroundPositions[3].scale, duration: 6.5, ease: 'power1.out' },
        ],
        // 4. Difusor de ar: upper-right -> waits inner lane while Roda climbs outer lane -> settles UPPER-RIGHT
        [
          { x: clampX(innerHoldX, scene06SurroundPositions[4].scale), y: clampY(-orbitRadiusY * 0.36, scene06SurroundPositions[4].scale), rotation: -5, scale: scene06SurroundPositions[4].scale, duration: 8.0, ease: 'sine.inOut' },
          { x: scene06SurroundPositions[4].x, y: scene06SurroundPositions[4].y, rotation: scene06SurroundPositions[4].rot, scale: scene06SurroundPositions[4].scale, duration: 6.5, ease: 'power1.out' },
        ],
        // 5. Roda: rear-right -> sweeps wide up right outer lane -> settles ABOVE car
        [
          { x: outerSweepX,                                                   y: clampY(orbitRadiusY * 0.22, scene06SurroundPositions[5].scale),  rotation: 16, scale: scene06SurroundPositions[5].scale, duration: 3.8, ease: 'sine.inOut' },
          { x: outerSweepX,                                                   y: clampY(-orbitRadiusY * 0.42, scene06SurroundPositions[5].scale), rotation: 10, scale: scene06SurroundPositions[5].scale, duration: 4.2, ease: 'sine.inOut' },
          { x: clampX(orbitRadiusX * 0.68, scene06SurroundPositions[5].scale), y: clampY(-orbitRadiusY * 0.80, scene06SurroundPositions[5].scale), rotation: 4,  scale: scene06SurroundPositions[5].scale, duration: 3.8, ease: 'sine.inOut' },
          { x: scene06SurroundPositions[5].x, y: scene06SurroundPositions[5].y, rotation: scene06SurroundPositions[5].rot, scale: scene06SurroundPositions[5].scale, duration: 3.2, ease: 'power1.out' },
        ],
      ];

      partElementsRef.current.forEach((el, i) => {
        if (!el) return;
        masterTl.to(
          el,
          { keyframes: scene06ArcKeyframes[i] },
          52 + i * 0.35
        );
      });

      masterTl.to(
        carWrapperRef.current,
        { scale: isMobile ? (isLandscape ? 0.56 : 0.64) : 0.78, duration: 15, ease: 'sine.inOut' },
        53
      );

      // --- SCENE 07: VEHICLE FADES OUT CLEANLY (68% -> 78%) ---
      masterTl.to(
        [carState1Ref.current, carState2Ref.current, carState3Ref.current, xrayGlowRef.current, carShadowRef.current],
        { opacity: 0, duration: 10, ease: 'power2.in' },
        68
      );

      masterTl.to(
        carWrapperRef.current,
        { scale: isMobile ? 0.55 : 0.65, duration: 10, ease: 'power2.in' },
        68
      );

      // --- SCENE 08: CLEAN PART-TO-CARD SETTLEMENT (77% -> 94%, HOLD -> 100%) ---
      masterTl.to(
        finalTitleRef.current,
        { opacity: 1, y: 0, duration: 11, ease: 'power2.out' },
        77
      );

      masterTl.to(
        cardsGridRef.current,
        { opacity: 1, duration: 10, pointerEvents: 'auto', ease: 'power2.out' },
        78
      );

      partElementsRef.current.forEach((el, i) => {
        if (!el) return;
        masterTl.to(
          el,
          {
            x: () => getCardLandingTarget(i).x,
            y: () => getCardLandingTarget(i).y,
            rotation: 0,
            scale: () => getCardLandingTarget(i).scale,
            duration: 12,
            ease: 'power3.inOut'
          },
          78 + i * 0.35
        );
      });

      partImageRefs.current.forEach((imgEl, i) => {
        if (!imgEl) return;
        masterTl.to(
          imgEl,
          {
            filter: 'drop-shadow(0px 0px 0px rgba(0, 0, 0, 0))',
            duration: 8,
            ease: 'power1.out'
          },
          82 + i * 0.35
        );
      });

      cardImageRefs.current.forEach((imgEl) => {
        if (!imgEl) return;
        masterTl.to(
          imgEl,
          { opacity: 1, duration: 1.5, ease: 'none' },
          90.2
        );
      });

      partElementsRef.current.forEach((el) => {
        if (!el) return;
        masterTl.to(
          el,
          { autoAlpha: 0, duration: 1.8, ease: 'power1.out' },
          91.7
        );
      });

      // Ensure final resting state from 94..100 holds completely steady
      masterTl.to({}, { duration: 6.5 }, 93.5);
    };

    mm.add('(prefers-reduced-motion: no-preference) and (min-width: 768px) and (min-height: 520px)', () => {
      buildResponsiveTimeline(false);
    });

    mm.add('(prefers-reduced-motion: no-preference) and (max-width: 767px), (prefers-reduced-motion: no-preference) and (max-height: 519px)', () => {
      buildResponsiveTimeline(true);
    });

    return () => {
      if (resizeTimer) clearTimeout(resizeTimer);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleOrientation);
      mm.revert();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={
        prefersReducedMotion
          ? 'relative w-full bg-[#F99B00] min-h-screen min-h-[100dvh]'
          : 'relative w-full bg-[#F99B00] min-h-[410dvh] md:min-h-[440vh]'
      }
      id="scroll-animation-stage"
    >
      <span
        id="categorias"
        aria-hidden="true"
        className={
          prefersReducedMotion
            ? 'absolute top-0 left-0 h-px w-px pointer-events-none'
            : 'absolute bottom-[100dvh] left-0 h-px w-px pointer-events-none'
        }
      />
      {/* Pinned Fullscreen Master Stage */}
      <div
        ref={viewportRef}
        className={
          prefersReducedMotion
            ? 'min-h-screen min-h-[100dvh] w-full flex flex-col justify-center pt-[max(4.75rem,calc(env(safe-area-inset-top)+3.75rem))] pb-20 sm:pb-12 px-3 sm:px-8 lg:px-12 select-none relative'
            : 'h-screen h-[100dvh] w-full overflow-hidden flex flex-col justify-between pt-[max(4.25rem,calc(env(safe-area-inset-top)+3.5rem))] sm:pt-20 pb-5 sm:pb-8 px-3 sm:px-8 lg:px-12 select-none relative'
        }
      >
        {/* Ambient Radial Lighting for Depth */}
        <div
          className="absolute inset-0 pointer-events-none opacity-35 mix-blend-overlay"
          style={{
            background: 'radial-gradient(ellipse at 50% 50%, rgba(255,255,255,0.45) 0%, rgba(249,155,0,0) 70%)'
          }}
        />

        {/* Animated Dot Wave Background Layer */}
        <DotWave
          color="0, 0, 0"
          gap={18}
          className="pointer-events-none absolute! inset-0 z-0 h-full min-h-0! bg-transparent! opacity-25"
        />

        {/* ========================================================================= */}
        {/* SCENE 01: HERO HEADLINE                                                   */}
        {/* ========================================================================= */}
        <div
          ref={heroTextRef}
          className="absolute inset-x-0 top-[max(4.75rem,calc(env(safe-area-inset-top)+3.9rem))] sm:top-[96px] md:top-[104px] lg:top-[110px] [@media(max-height:500px)_and_(orientation:landscape)]:top-[64px] z-10 flex flex-col items-center text-center pointer-events-none px-3 sm:px-8 lg:px-12 select-none"
        >
          <h1
            className="font-hero-display uppercase text-black leading-[1.0] drop-shadow-sm w-full max-w-[94vw] xl:max-w-7xl mx-auto text-[clamp(2.1rem,min(11.4vw,7.4dvh),3.3rem)] sm:text-[clamp(2.2rem,min(10.5vw,13.2dvh),7.8rem)] [@media(max-height:500px)_and_(orientation:landscape)]:text-[clamp(1.6rem,min(6vw,10.5dvh),2.4rem)]"
          >
            <span className="block">
              {HERO_COPY.headlineLine1}
            </span>
            <span className="block mt-[0.06em] sm:mt-[0.09em] sm:whitespace-nowrap">
              <span className="block sm:inline">
                {HERO_COPY.headlineLine2Prefix.trimEnd()}
                <span className="hidden sm:inline">{' '}</span>
              </span>
              {prefersReducedMotion ? (
                <span className="block sm:inline text-white drop-shadow-md mt-[0.05em] sm:mt-0">
                  {HERO_COPY.headlineLine2Highlight}
                </span>
              ) : (
                <span className="inline-grid align-bottom justify-items-center sm:justify-items-start text-center sm:text-left mt-[0.05em] sm:mt-0 max-w-full">
                  {HERO_ROTATING_WORDS.map((word) => (
                    <span
                      key={word}
                      aria-hidden="true"
                      className="col-start-1 row-start-1 invisible pointer-events-none select-none whitespace-nowrap"
                    >
                      {word}
                    </span>
                  ))}
                  <span className="col-start-1 row-start-1">
                    <WordRotate
                      words={HERO_ROTATING_WORDS}
                      intervalMs={2200}
                      className="text-white drop-shadow-md py-[0.06em] -my-[0.06em] px-[0.04em] -mx-[0.04em]"
                    />
                  </span>
                </span>
              )}
            </span>
          </h1>
        </div>

        {/* ========================================================================= */}
        {/* SCENE 01–06: REGISTERED 3-STATE VERTICAL BLACK VEHICLE (848x1264)         */}
        {/* ========================================================================= */}
        <div
          ref={carWrapperRef}
          className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none"
        >
          <div className="relative h-[46dvh] min-[390px]:h-[50dvh] sm:h-[58dvh] md:h-[60dvh] lg:h-[62dvh] max-h-[420px] sm:max-h-[580px] [@media(max-height:500px)_and_(orientation:landscape)]:h-[52dvh] aspect-[848/1264] flex items-center justify-center">
            {/* Soft vertical ground shadow */}
            <div
              ref={carShadowRef}
              className="absolute w-[76%] h-[92%] bg-black/40 blur-3xl rounded-full transform"
            />

            {/* X-Ray Internal Technical Glow */}
            <div
              ref={xrayGlowRef}
              className="absolute w-[68%] h-[84%] bg-cyan-400/20 blur-2xl rounded-full pointer-events-none"
            />

            {/* State 3: Disassembled Black Chassis (revealed cleanly as parts leave) */}
            <img
              ref={carState3Ref}
              src={HERO_COPY.carBlackDisassembled}
              alt="Estrutura desmontada do veículo preto Nova Viseu"
              referrerPolicy="no-referrer"
              decoding="async"
              fetchPriority="low"
              className="absolute inset-0 w-full h-full object-contain filter drop-shadow-xl z-10"
            />

            {/* State 2: Registered Technical X-Ray Chassis (progressive nose-to-tail cutaway wipe) */}
            <img
              ref={carState2Ref}
              src={HERO_COPY.carBlackXray}
              alt="Estrutura interna raio-x do veículo preto Nova Viseu"
              referrerPolicy="no-referrer"
              decoding="async"
              fetchPriority="low"
              style={{
                maskImage:
                  'linear-gradient(to bottom, transparent calc(var(--xray-wipe, -12%) - 8%), #000 calc(var(--xray-wipe, -12%) + 8%))',
                WebkitMaskImage:
                  'linear-gradient(to bottom, transparent calc(var(--xray-wipe, -12%) - 8%), #000 calc(var(--xray-wipe, -12%) + 8%))'
              }}
              className="absolute inset-0 w-full h-full object-contain filter drop-shadow-xl z-[15]"
            />

            {/* State 1: Complete Intact Obsidian Black Vehicle (Scene 01 opening) */}
            <img
              ref={carState1Ref}
              src={HERO_COPY.carBlackComplete}
              alt="Automóvel preto completo visto de cima Nova Viseu"
              referrerPolicy="no-referrer"
              loading="eager"
              fetchPriority="high"
              decoding="sync"
              className="absolute inset-0 w-full h-full object-contain filter drop-shadow-[0_24px_38px_rgba(0,0,0,0.45)] z-20"
            />
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SCENES 03–08: SIX FLOATING AUTOMOTIVE PART CUTOUTS                        */}
        {/* ========================================================================= */}
        <div className="absolute inset-0 z-[35] pointer-events-none flex items-center justify-center">
          {CATEGORIES.map((cat, idx) => (
            <div
              key={`floating-part-${cat.id}`}
              ref={(el) => {
                partElementsRef.current[idx] = el;
              }}
              className="absolute w-24 h-24 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-56 lg:h-56 [@media(max-height:500px)_and_(orientation:landscape)]:w-24 [@media(max-height:500px)_and_(orientation:landscape)]:h-24 flex items-center justify-center"
            >
              <img
                ref={(el) => {
                  partImageRefs.current[idx] = el;
                }}
                src={cat.image}
                alt=""
                aria-hidden="true"
                referrerPolicy="no-referrer"
                decoding="async"
                fetchPriority="low"
                className="w-full h-full object-contain"
              />
            </div>
          ))}
        </div>

        {/* ========================================================================= */}
        {/* SCENE 08: FINAL CATEGORY RESOLUTION                                       */}
        {/* Mobile Portrait: 2x3 (MOTOR|FAROL / CÂMBIO|ALTERNADOR / DIFUSOR|RODA)      */}
        {/* Tablet / Desktop / Landscape: 3x2                                         */}
        {/* ========================================================================= */}
        <div className="relative z-[25] w-full max-w-6xl mx-auto my-auto flex flex-col justify-center pb-2 sm:pb-0 [@media(max-height:500px)_and_(orientation:landscape)]:pb-0">
          {/* Final Headline with Anton Font */}
          <div ref={finalTitleRef} className="text-center mb-3 min-[375px]:mb-4 sm:mb-6 lg:mb-[min(1.75rem,3dvh)] [@media(max-height:500px)_and_(orientation:landscape)]:mb-2 pointer-events-none">
            <h2 className="font-display text-2xl min-[375px]:text-3xl sm:text-5xl md:text-6xl lg:text-[clamp(3.1rem,7dvh,4.5rem)] [@media(max-height:500px)_and_(orientation:landscape)]:text-2xl font-black uppercase tracking-normal text-black leading-[1.04] sm:leading-tight drop-shadow-sm">
              <span className="block">{HERO_COPY.finalHeadlineLine1}</span>
              <span className="block text-white drop-shadow-md">
                {HERO_COPY.finalHeadlineLine2}
              </span>
            </h2>
          </div>

          {/* Six Category Cards */}
          <div
            ref={cardsGridRef}
            className="grid grid-cols-2 sm:grid-cols-3 [@media(max-height:500px)_and_(orientation:landscape)]:grid-cols-3 gap-2.5 min-[375px]:gap-3 sm:gap-5 lg:gap-8 w-full"
          >
            {CATEGORIES.map((category, index) => (
              <div
                key={category.id}
                ref={(el) => {
                  cardElementsRef.current[index] = el;
                }}
                className="h-full"
              >
                <CategoryCard
                  category={category}
                  imageRef={(el) => {
                    cardImageRefs.current[index] = el;
                  }}
                />
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
