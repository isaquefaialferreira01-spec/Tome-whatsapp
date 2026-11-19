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
      gsap.set(carState2Ref.current, { opacity: 0 });
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

      // Mobile viewport safe stage metrics (accounting for FloatingNavbar & bottom WhatsApp clearance)
      const mobileTopSafe = isLandscape ? 54 : 76;
      const mobileBottomSafe = isLandscape ? 16 : 64;
      const mobileUsableH = Math.max(260, height - mobileTopSafe - mobileBottomSafe);
      const mobileCenterY = isMobile ? (mobileTopSafe - mobileBottomSafe) / 2 : 0;

      const targetMobileCarH = isLandscape
        ? Math.min(mobileUsableH * 0.56, 220)
        : Math.min(mobileUsableH * 0.47, width * 0.78, 312);
      const targetMobileCarW = targetMobileCarH * (848 / 1264);
      const mobileCarScale = isMobile ? targetMobileCarH / carHeight : 1;

      const mobilePartScale = isLandscape
        ? 0.56
        : Math.min(0.76, Math.max(0.56, (width - targetMobileCarW - 44) / (2 * partBasePx)));
      const mobilePartVis = partBasePx * mobilePartScale;
      const mobileMinSideX = targetMobileCarW * 0.46 + mobilePartVis * 0.46 + 8;
      const mobileMaxSideX = width / 2 - mobilePartVis * 0.48 - 8;
      const mobileSideX = Math.max(76, Math.min(mobileMaxSideX, Math.max(mobileMinSideX, (mobileMinSideX + mobileMaxSideX) / 2)));

      const mobileGapY = Math.max(12, Math.min(20, (mobileUsableH - targetMobileCarH - 2 * mobilePartVis) * 0.28));
      const mobileTopBottomDist = Math.min(
        mobileUsableH / 2 - mobilePartVis * 0.52,
        targetMobileCarH / 2 + mobilePartVis * 0.5 + mobileGapY
      );

      // Mobile viewport boundary clamping so parts never get pushed off-screen on 320px–430px devices
      const clampX = (rawX: number, scale: number) => {
        if (!isMobile) return rawX;
        const margin = width <= 360 ? 6 : 10;
        const maxOffset = Math.max(40, width / 2 - (partBasePx * scale) / 2 - margin);
        return Math.max(-maxOffset, Math.min(maxOffset, rawX));
      };
      const clampY = (rawY: number, scale: number) => {
        if (!isMobile) return rawY;
        const halfPart = (partBasePx * scale) / 2;
        const minOffset = -(height / 2 - mobileTopSafe - halfPart);
        const maxOffset = height / 2 - mobileBottomSafe - halfPart;
        return Math.max(minOffset, Math.min(maxOffset, rawY));
      };

      // STEP 1: PHYSICAL CHASSIS ORIGINS (calibrated to 848x1264 cutaway engine/cabin/wheel wells)
      const originCarH = isMobile ? targetMobileCarH : carHeight;
      const originCarW = isMobile ? targetMobileCarW : carWidth;
      const physicalChassisOrigins = [
        { x: 0,                  y: mobileCenterY - 0.30 * originCarH, rot: 0 },   // 0. Motor (engine compartment)
        { x: -0.27 * originCarW, y: mobileCenterY - 0.38 * originCarH, rot: 8 },   // 1. Farol (front-left headlight)
        { x: 0.02 * originCarW,  y: mobileCenterY - 0.08 * originCarH, rot: 0 },   // 2. Câmbio (transmission tunnel)
        { x: -0.16 * originCarW, y: mobileCenterY - 0.25 * originCarH, rot: -8 },  // 3. Alternador (engine accessory bay)
        { x: 0.12 * originCarW,  y: mobileCenterY - 0.18 * originCarH, rot: 0 },   // 4. Difusor de ar (dashboard area)
        { x: 0.34 * originCarW,  y: mobileCenterY + 0.28 * originCarH, rot: 12 },  // 5. Roda (rear-right wheel arch)
      ];

      // STEP 2: EXTRACTION TRAJECTORIES (clean non-overlapping detachment on mobile, preserved on desktop)
      const extractionOffsets = isMobile
        ? [
            { x: 0,                                         y: clampY(mobileCenterY - mobileTopBottomDist, mobilePartScale),             rot: -2,  scale: mobilePartScale },        // 0. Motor clears front hood
            { x: clampX(-mobileSideX, mobilePartScale),     y: clampY(mobileCenterY + targetMobileCarH * 0.12, mobilePartScale), rot: -8,  scale: mobilePartScale * 0.96 }, // 1. Farol clears left flank cleanly before Alternador emerges
            { x: clampX(mobileSideX, mobilePartScale),      y: clampY(mobileCenterY + targetMobileCarH * 0.05, mobilePartScale), rot: 8,   scale: mobilePartScale * 0.98 }, // 2. Câmbio clears right door
            { x: clampX(-mobileSideX, mobilePartScale),     y: clampY(mobileCenterY - targetMobileCarH * 0.25, mobilePartScale), rot: -6,  scale: mobilePartScale * 0.96 }, // 3. Alternador emerges directly left from engine bay
            { x: clampX(mobileSideX, mobilePartScale),      y: clampY(mobileCenterY - targetMobileCarH * 0.30, mobilePartScale), rot: 6,   scale: mobilePartScale * 0.94 }, // 4. Difusor clears upper-right fender
            { x: clampX(mobileSideX, mobilePartScale),      y: clampY(mobileCenterY + targetMobileCarH * 0.35, mobilePartScale), rot: 18,  scale: mobilePartScale },        // 5. Roda clears rear-right wheel arch
          ]
        : [
            { x: 0,                y: -0.52 * carHeight, rot: -2,  scale: 0.86 },
            { x: -0.70 * carWidth, y: -0.40 * carHeight, rot: -10, scale: 0.82 },
            { x: 0.72 * carWidth,  y: 0.04 * carHeight,  rot: 8,   scale: 0.84 },
            { x: -0.72 * carWidth, y: 0.04 * carHeight,  rot: -8,  scale: 0.82 },
            { x: 0.70 * carWidth,  y: -0.24 * carHeight, rot: 6,   scale: 0.80 },
            { x: 0.64 * carWidth,  y: 0.40 * carHeight,  rot: 22,  scale: 0.86 },
          ];

      // STEP 3: SCENE 06 - BALANCED SURROUNDING FORMATION AROUND CENTRAL VEHICLE
      const orbitRadiusX = Math.min(width * 0.34, 410);
      const orbitRadiusY = Math.min(height * 0.34, 320);

      const scene06SurroundPositions = isMobile
        ? [
            { x: 0,                                      y: clampY(mobileCenterY + mobileTopBottomDist, mobilePartScale),             rot: 0,  scale: mobilePartScale },        // 0. Motor (below vehicle)
            { x: clampX(-mobileSideX, mobilePartScale),  y: clampY(mobileCenterY + targetMobileCarH * 0.27, mobilePartScale), rot: 5,  scale: mobilePartScale * 0.96 }, // 1. Farol (lower-left)
            { x: clampX(mobileSideX, mobilePartScale),   y: clampY(mobileCenterY + targetMobileCarH * 0.23, mobilePartScale), rot: -4, scale: mobilePartScale * 0.98 }, // 2. Câmbio (right side)
            { x: clampX(-mobileSideX, mobilePartScale),  y: clampY(mobileCenterY - targetMobileCarH * 0.22, mobilePartScale), rot: 4,  scale: mobilePartScale * 0.96 }, // 3. Alternador (left side)
            { x: clampX(mobileSideX, mobilePartScale),   y: clampY(mobileCenterY - targetMobileCarH * 0.29, mobilePartScale), rot: -5, scale: mobilePartScale * 0.94 }, // 4. Difusor de ar (upper-right)
            { x: 0,                                      y: clampY(mobileCenterY - mobileTopBottomDist, mobilePartScale),             rot: 0,  scale: mobilePartScale * 1.02 }, // 5. Roda (above vehicle)
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
          scale: isMobile ? 0.12 : 0.14,
          rotation: origin.rot,
          autoAlpha: 0,
          display: 'flex',
          zIndex: 35
        });
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
          y: isMobile ? mobileCenterY : 0,
          scale: isMobile ? mobileCarScale : 1,
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
        { opacity: 0.5, duration: 10, ease: 'power1.inOut' },
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
            duration: 12,
            ease: 'power2.out'
          },
          23
        );
      }

      // --- SCENE 04: HEADLIGHT EXTRACTION SECOND (30% -> 41%) ---
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
            duration: 11,
            ease: 'power2.out'
          },
          30
        );
      }

      // --- SCENE 05: REMAINING EXTRACTIONS + PURE GPU OPACITY X-RAY TO DISASSEMBLED CROSSFADE (36% -> 53%) ---
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
            duration: 11,
            ease: 'power2.out'
          },
          36 + stepIndex * 3.0
        );
      });

      // Pure opacity crossfade from X-ray (State 2) to Disassembled chassis (State 3) avoids Safari mask-line artifacts
      masterTl.to(
        carState3Ref.current,
        { opacity: 1, duration: 18, ease: 'power1.inOut' },
        28
      );
      masterTl.to(
        carState2Ref.current,
        { opacity: 0, duration: 18, ease: 'power1.inOut' },
        31
      );

      // --- SCENE 06: SIX COMPONENTS ORBIT PERIMETER AROUND CENTRAL VEHICLE (52% -> 67%) ---
      const rawOuterSweepX = isMobile ? mobileSideX * 1.12 : orbitRadiusX * 1.24;
      const orbitPartFootprint = partBasePx * (isMobile ? mobilePartScale : 0.86) * 1.08;
      const maxViewportPartX = Math.max(72, width / 2 - orbitPartFootprint / 2 - 6);
      const outerSweepX = Math.min(rawOuterSweepX, maxViewportPartX);
      const innerHoldX = isMobile ? Math.max(targetMobileCarW * 0.42 + mobilePartVis * 0.38, mobileSideX * 0.72) : orbitRadiusX * 0.68;
      const cornerTuckX = isMobile ? Math.max(targetMobileCarW * 0.31 + mobilePartVis * 0.44, mobileSideX * 0.64) : orbitRadiusX * 0.68;

      const scene06ArcKeyframes: gsap.TweenVars[][] = isMobile
        ? [
            // 0. Motor: leaves top -> glides down outer-left after Alternador arcs above hood -> settles BELOW vehicle
            [
              { x: clampX(-mobileSideX * 0.90, scene06SurroundPositions[0].scale), y: clampY(mobileCenterY - mobileTopBottomDist * 0.68, scene06SurroundPositions[0].scale), rotation: -6, scale: scene06SurroundPositions[0].scale, duration: 3.4, ease: 'sine.inOut' },
              { x: -outerSweepX,                                                   y: clampY(mobileCenterY - targetMobileCarH * 0.04, scene06SurroundPositions[0].scale), rotation: -8, scale: scene06SurroundPositions[0].scale, duration: 4.2, ease: 'sine.inOut' },
              { x: clampX(-mobileSideX * 0.88, scene06SurroundPositions[0].scale), y: clampY(mobileCenterY + mobileTopBottomDist * 0.72, scene06SurroundPositions[0].scale), rotation: -4, scale: scene06SurroundPositions[0].scale, duration: 3.4, ease: 'sine.inOut' },
              { x: scene06SurroundPositions[0].x, y: scene06SurroundPositions[0].y, rotation: scene06SurroundPositions[0].rot, scale: scene06SurroundPositions[0].scale, duration: 2.8, ease: 'power1.out' },
            ],
            // 1. Farol: tucks inward at lower-left trunk taper while Motor sweeps past outer-left
            [
              { x: clampX(-cornerTuckX, scene06SurroundPositions[1].scale), y: clampY(mobileCenterY + targetMobileCarH * 0.34, scene06SurroundPositions[1].scale), rotation: 2, scale: scene06SurroundPositions[1].scale, duration: 6.2, ease: 'sine.inOut' },
              { x: scene06SurroundPositions[1].x, y: scene06SurroundPositions[1].y, rotation: scene06SurroundPositions[1].rot, scale: scene06SurroundPositions[1].scale, duration: 7.0, ease: 'power1.out' },
            ],
            // 2. Câmbio: tucks promptly to narrow lower-right trunk corner while Roda climbs outer-right, then settles to right-lower
            [
              { x: clampX(cornerTuckX, scene06SurroundPositions[2].scale), y: clampY(mobileCenterY + targetMobileCarH * 0.36, scene06SurroundPositions[2].scale), rotation: -2, scale: scene06SurroundPositions[2].scale, duration: 4.0, ease: 'sine.inOut' },
              { x: clampX(cornerTuckX, scene06SurroundPositions[2].scale), y: clampY(mobileCenterY + targetMobileCarH * 0.34, scene06SurroundPositions[2].scale), rotation: -2, scale: scene06SurroundPositions[2].scale, duration: 2.8, ease: 'sine.inOut' },
              { x: scene06SurroundPositions[2].x, y: scene06SurroundPositions[2].y, rotation: scene06SurroundPositions[2].rot, scale: scene06SurroundPositions[2].scale, duration: 6.4, ease: 'power1.out' },
            ],
            // 3. Alternador: arcs cleanly above hood edge into empty 12:00 top-center slot while Motor sweeps down left, then arcs back to 10:00
            [
              { x: clampX(-mobileSideX * 0.72, scene06SurroundPositions[3].scale), y: clampY(mobileCenterY - mobileTopBottomDist * 0.88, scene06SurroundPositions[3].scale), rotation: 3, scale: scene06SurroundPositions[3].scale, duration: 2.8, ease: 'sine.inOut' },
              { x: 0,                                                              y: clampY(mobileCenterY - mobileTopBottomDist * 0.98, scene06SurroundPositions[3].scale), rotation: 2, scale: scene06SurroundPositions[3].scale, duration: 3.0, ease: 'sine.inOut' },
              { x: clampX(-mobileSideX * 0.72, scene06SurroundPositions[3].scale), y: clampY(mobileCenterY - mobileTopBottomDist * 0.86, scene06SurroundPositions[3].scale), rotation: 3, scale: scene06SurroundPositions[3].scale, duration: 3.2, ease: 'sine.inOut' },
              { x: scene06SurroundPositions[3].x, y: scene06SurroundPositions[3].y, rotation: scene06SurroundPositions[3].rot, scale: scene06SurroundPositions[3].scale, duration: 4.2, ease: 'power1.out' },
            ],
            // 4. Difusor de ar: tucks neatly at tapered upper-right hood corner while Roda passes mid-right outer lane
            [
              { x: clampX(cornerTuckX * 0.90, scene06SurroundPositions[4].scale), y: clampY(mobileCenterY - targetMobileCarH * 0.44, scene06SurroundPositions[4].scale), rotation: -4, scale: scene06SurroundPositions[4].scale, duration: 5.6, ease: 'sine.inOut' },
              { x: scene06SurroundPositions[4].x, y: scene06SurroundPositions[4].y, rotation: scene06SurroundPositions[4].rot, scale: scene06SurroundPositions[4].scale, duration: 7.6, ease: 'power1.out' },
            ],
            // 5. Roda: sweeps smoothly up wide right outer lane -> settles ABOVE vehicle
            [
              { x: outerSweepX,                                                   y: clampY(mobileCenterY + targetMobileCarH * 0.04, scene06SurroundPositions[5].scale), rotation: 12, scale: scene06SurroundPositions[5].scale, duration: 3.0, ease: 'sine.inOut' },
              { x: outerSweepX,                                                   y: clampY(mobileCenterY - mobileTopBottomDist * 0.48, scene06SurroundPositions[5].scale), rotation: 8, scale: scene06SurroundPositions[5].scale, duration: 3.6, ease: 'sine.inOut' },
              { x: clampX(mobileSideX * 0.72, scene06SurroundPositions[5].scale), y: clampY(mobileCenterY - mobileTopBottomDist * 0.90, scene06SurroundPositions[5].scale), rotation: 4, scale: scene06SurroundPositions[5].scale, duration: 3.4, ease: 'sine.inOut' },
              { x: scene06SurroundPositions[5].x, y: scene06SurroundPositions[5].y, rotation: scene06SurroundPositions[5].rot, scale: scene06SurroundPositions[5].scale, duration: 3.2, ease: 'power1.out' },
            ],
          ]
        : [
            // Desktop preserved orbit arcs
            [
              { x: -orbitRadiusX * 0.78, y: -orbitRadiusY * 0.78, rotation: -6, scale: scene06SurroundPositions[0].scale, duration: 3.6, ease: 'sine.inOut' },
              { x: -outerSweepX,         y: -orbitRadiusY * 0.04, rotation: -9, scale: scene06SurroundPositions[0].scale, duration: 4.4, ease: 'sine.inOut' },
              { x: -orbitRadiusX * 0.74, y: orbitRadiusY * 0.76,  rotation: -4, scale: scene06SurroundPositions[0].scale, duration: 3.8, ease: 'sine.inOut' },
              { x: scene06SurroundPositions[0].x, y: scene06SurroundPositions[0].y, rotation: scene06SurroundPositions[0].rot, scale: scene06SurroundPositions[0].scale, duration: 3.2, ease: 'power1.out' },
            ],
            [
              { x: -innerHoldX, y: orbitRadiusY * 0.12, rotation: 2, scale: scene06SurroundPositions[1].scale, duration: 8.2, ease: 'sine.inOut' },
              { x: scene06SurroundPositions[1].x, y: scene06SurroundPositions[1].y, rotation: scene06SurroundPositions[1].rot, scale: scene06SurroundPositions[1].scale, duration: 6.8, ease: 'power1.out' },
            ],
            [
              { x: innerHoldX, y: orbitRadiusY * 0.06, rotation: -4, scale: scene06SurroundPositions[2].scale, duration: 8.0, ease: 'sine.inOut' },
              { x: scene06SurroundPositions[2].x, y: scene06SurroundPositions[2].y, rotation: scene06SurroundPositions[2].rot, scale: scene06SurroundPositions[2].scale, duration: 6.5, ease: 'power1.out' },
            ],
            [
              { x: -innerHoldX, y: -orbitRadiusY * 0.10, rotation: 5, scale: scene06SurroundPositions[3].scale, duration: 8.0, ease: 'sine.inOut' },
              { x: scene06SurroundPositions[3].x, y: scene06SurroundPositions[3].y, rotation: scene06SurroundPositions[3].rot, scale: scene06SurroundPositions[3].scale, duration: 6.5, ease: 'power1.out' },
            ],
            [
              { x: innerHoldX, y: -orbitRadiusY * 0.36, rotation: -5, scale: scene06SurroundPositions[4].scale, duration: 8.0, ease: 'sine.inOut' },
              { x: scene06SurroundPositions[4].x, y: scene06SurroundPositions[4].y, rotation: scene06SurroundPositions[4].rot, scale: scene06SurroundPositions[4].scale, duration: 6.5, ease: 'power1.out' },
            ],
            [
              { x: outerSweepX,         y: orbitRadiusY * 0.22,  rotation: 16, scale: scene06SurroundPositions[5].scale, duration: 3.8, ease: 'sine.inOut' },
              { x: outerSweepX,         y: -orbitRadiusY * 0.42, rotation: 10, scale: scene06SurroundPositions[5].scale, duration: 4.2, ease: 'sine.inOut' },
              { x: orbitRadiusX * 0.68, y: -orbitRadiusY * 0.80, rotation: 4,  scale: scene06SurroundPositions[5].scale, duration: 3.8, ease: 'sine.inOut' },
              { x: scene06SurroundPositions[5].x, y: scene06SurroundPositions[5].y, rotation: scene06SurroundPositions[5].rot, scale: scene06SurroundPositions[5].scale, duration: 3.2, ease: 'power1.out' },
            ],
          ];

      partElementsRef.current.forEach((el, i) => {
        if (!el) return;
        masterTl.to(
          el,
          { keyframes: scene06ArcKeyframes[i] },
          52 + i * 0.25
        );
      });

      if (!isMobile) {
        masterTl.to(
          carWrapperRef.current,
          { scale: 0.78, duration: 15, ease: 'sine.inOut' },
          53
        );
      }

      // --- SCENE 07: VEHICLE FADES OUT CLEANLY (68% -> 77%) ---
      masterTl.to(
        [carState1Ref.current, carState2Ref.current, carState3Ref.current, xrayGlowRef.current, carShadowRef.current],
        { opacity: 0, duration: 9, ease: 'power2.in' },
        68
      );

      masterTl.to(
        carWrapperRef.current,
        { scale: isMobile ? mobileCarScale * 0.90 : 0.65, duration: 9, ease: 'power2.in' },
        68
      );

      // --- SCENE 08: CLEAN PART-TO-CARD SETTLEMENT (77% -> 94%, HOLD -> 100%) ---
      masterTl.to(
        finalTitleRef.current,
        { opacity: 1, y: 0, duration: 10, ease: 'power2.out' },
        76
      );

      masterTl.to(
        cardsGridRef.current,
        { opacity: 1, duration: 9, pointerEvents: 'auto', ease: 'power2.out' },
        77
      );

      // On mobile, guide crossing parts through proportional separated lanes so they never overlap even at 320px
      partElementsRef.current.forEach((el, i) => {
        if (!el) return;
        if (isMobile) {
          const midLanePoints: Record<number, { x: number; y: number }> = {
            0: { x: -mobileSideX * 0.78, y: mobileCenterY },                                 // Motor arcs up left lane
            1: { x: width * 0.10,        y: mobileCenterY - targetMobileCarH * 0.36 },        // Farol sweeps across upper arc
            2: { x: width * 0.14,        y: mobileCenterY + targetMobileCarH * 0.14 },        // Câmbio crosses lower-middle right-biased
            3: { x: -width * 0.14,       y: mobileCenterY - targetMobileCarH * 0.08 },        // Alternador crosses upper-middle left-biased
            4: { x: -width * 0.10,       y: mobileCenterY + targetMobileCarH * 0.38 },        // Difusor sweeps across lower arc
            5: { x: mobileSideX * 0.78,  y: mobileCenterY },                                 // Roda arcs down right lane
          };
          const wp = midLanePoints[i];
          const mobileLandStarts = [77, 78.8, 79.4, 79.4, 78.8, 77];
          masterTl.to(
            el,
            {
              keyframes: [
                { x: wp.x, y: wp.y, rotation: 0, duration: 5.5, ease: 'sine.inOut' },
                {
                  x: () => getCardLandingTarget(i).x,
                  y: () => getCardLandingTarget(i).y,
                  rotation: 0,
                  scale: () => getCardLandingTarget(i).scale,
                  duration: 6.5,
                  ease: 'power2.out'
                }
              ]
            },
            mobileLandStarts[i]
          );
        } else {
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
        }
      });

      cardImageRefs.current.forEach((imgEl) => {
        if (!imgEl) return;
        masterTl.to(
          imgEl,
          { opacity: 1, duration: 1.2, ease: 'none' },
          91.2
        );
      });

      partElementsRef.current.forEach((el) => {
        if (!el) return;
        masterTl.to(
          el,
          { autoAlpha: 0, duration: 1.4, ease: 'power1.out' },
          92.2
        );
      });

      // Ensure final resting state from 94..100 holds completely steady
      masterTl.to({}, { duration: 6.4 }, 93.6);
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
          ? 'relative w-full bg-[#F99B00] min-h-screen min-h-[100svh]'
          : 'relative w-full bg-[#F99B00] min-h-[360svh] md:min-h-[440vh]'
      }
      id="scroll-animation-stage"
    >
      <span
        id="categorias"
        aria-hidden="true"
        className={
          prefersReducedMotion
            ? 'absolute top-0 left-0 h-px w-px pointer-events-none'
            : 'absolute bottom-[100svh] md:bottom-[100dvh] left-0 h-px w-px pointer-events-none'
        }
      />
      {/* Pinned Fullscreen Master Stage */}
      <div
        ref={viewportRef}
        className={
          prefersReducedMotion
            ? 'min-h-screen min-h-[100svh] w-full flex flex-col justify-center pt-[max(4.75rem,calc(env(safe-area-inset-top)+3.75rem))] pb-20 sm:pb-12 px-3 sm:px-8 lg:px-12 select-none relative'
            : 'h-[100svh] md:h-[100dvh] w-full overflow-hidden flex flex-col justify-between pt-[max(4.25rem,calc(env(safe-area-inset-top)+3.5rem))] sm:pt-20 pb-5 sm:pb-8 px-3 sm:px-8 lg:px-12 select-none relative'
        }
      >
        {/* Ambient Radial Lighting for Depth (pure radial gradient without blend-mode layer boundaries) */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at 50% 50%, rgba(255,255,255,0.16) 0%, rgba(249,155,0,0) 70%)'
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
          <div className="relative h-[46svh] min-[390px]:h-[50svh] sm:h-[58dvh] md:h-[60dvh] lg:h-[62dvh] max-h-[420px] sm:max-h-[580px] [@media(max-height:500px)_and_(orientation:landscape)]:h-[52svh] aspect-[848/1264] flex items-center justify-center">
            {/* Silhouette-proportioned natural ground shadow (pure radial gradient without blur/box artifacts) */}
            <div
              ref={carShadowRef}
              aria-hidden="true"
              className="absolute w-[74%] h-[88%] pointer-events-none"
              style={{
                background:
                  'radial-gradient(ellipse 48% 48% at 50% 50%, rgba(0, 0, 0, 0.34) 0%, rgba(0, 0, 0, 0.14) 48%, rgba(0, 0, 0, 0) 72%)'
              }}
            />

            {/* X-Ray Internal Technical Glow (pure radial gradient without blur artifacts) */}
            <div
              ref={xrayGlowRef}
              aria-hidden="true"
              className="absolute w-[70%] h-[84%] pointer-events-none"
              style={{
                background:
                  'radial-gradient(ellipse 48% 48% at 50% 50%, rgba(34, 211, 238, 0.22) 0%, rgba(34, 211, 238, 0) 70%)'
              }}
            />

            {/* State 3: Disassembled Black Chassis (revealed cleanly via GPU opacity crossfade) */}
            <img
              ref={carState3Ref}
              src={HERO_COPY.carBlackDisassembled}
              alt="Estrutura desmontada do veículo preto Nova Viseu"
              referrerPolicy="no-referrer"
              decoding="async"
              fetchPriority="low"
              className="absolute inset-0 w-full h-full object-contain z-10"
            />

            {/* State 2: Registered Technical X-Ray Chassis */}
            <img
              ref={carState2Ref}
              src={HERO_COPY.carBlackXray}
              alt="Estrutura interna raio-x do veículo preto Nova Viseu"
              referrerPolicy="no-referrer"
              decoding="async"
              fetchPriority="low"
              className="absolute inset-0 w-full h-full object-contain z-[15]"
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
              className="absolute inset-0 w-full h-full object-contain z-20"
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
