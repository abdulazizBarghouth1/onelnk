import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { GalleryItemData } from './HorizontalGallery';
import '../../../../css/onelnk-gallery-fx.css';

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface Props {
  items: GalleryItemData[];
  /** Used when there are no admin-uploaded items yet. */
  fallback?: string[];
}

/** mouse + not reduced-motion → the tilt/foil is worth wiring up. */
function canInteract(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return (
    window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

/**
 * A single gallery tile. Keeps its own refs so the pointer handlers can write
 * the tilt transform + sheen position straight to the DOM (via rAF) without a
 * React re-render per mousemove.
 */
function CardTile({ image }: { image: string }) {
  const rootRef = useRef<HTMLElement>(null);
  const tiltRef = useRef<HTMLDivElement>(null);
  const sheenRef = useRef<HTMLDivElement>(null);
  const holoRef = useRef<HTMLDivElement>(null);
  const raf = useRef<number>(0);

  const onEnter = () => {
    if (!canInteract()) return;
    rootRef.current?.classList.add('is-hovered');
  };

  const onMove = (e: React.PointerEvent<HTMLElement>) => {
    if (!canInteract()) return;
    const root = rootRef.current;
    const tilt = tiltRef.current;
    if (!root || !tilt) return;
    const r = root.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width; // 0..1 across
    const py = (e.clientY - r.top) / r.height; // 0..1 down
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(() => {
      const rx = (0.5 - py) * 10; // tilt back/forward
      const ry = (px - 0.5) * 13; // tilt left/right
      tilt.style.transform = `rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) translateZ(16px) scale(1.04)`;
      if (sheenRef.current) {
        sheenRef.current.style.setProperty('--mx', `${(px * 100).toFixed(1)}%`);
        sheenRef.current.style.setProperty('--my', `${(py * 100).toFixed(1)}%`);
      }
      // Hue rides the horizontal position so the foil shifts as you sweep across.
      holoRef.current?.style.setProperty('--hue', `${Math.round(60 + px * 240)}`);
    });
  };

  const onLeave = () => {
    const root = rootRef.current;
    const tilt = tiltRef.current;
    cancelAnimationFrame(raf.current);
    root?.classList.remove('is-hovered');
    if (tilt) tilt.style.transform = '';
  };

  return (
    <article
      className="glcard"
      ref={rootRef}
      onPointerEnter={onEnter}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
    >
      <div className="glcard__float">
        <div className="glcard__tilt" ref={tiltRef}>
          <div className="glcard__art">
            <img src={image} alt="" loading="lazy" />
          </div>
          <div className="glcard__holo" ref={holoRef} aria-hidden="true" />
          <div className="glcard__sheen" ref={sheenRef} aria-hidden="true" />
        </div>
      </div>
    </article>
  );
}

/**
 * 2-column grid of card designs for the /gallery page. The tiles float on the
 * bone surface (no white frame), deal in like a hand of cards on scroll, bob
 * gently at rest, and tilt toward the pointer with a holographic foil + sheen.
 * All motion is skipped under reduced-motion (cards stay static and legible).
 */
export default function GalleryGrid({ items, fallback = [] }: Props) {
  const gridRef = useRef<HTMLDivElement>(null);
  const cards = items.length > 0 ? items : fallback.map((image, i) => ({ id: `fb-${i}`, image }));

  useGSAP(
    () => {
      const grid = gridRef.current;
      if (!grid) return;
      if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;

      const tiles = gsap.utils.toArray<HTMLElement>('.glcard', grid);
      if (!tiles.length) return;

      // "Deal the deck": each card starts low, shrunk and fanned a few degrees,
      // then snaps square as it enters — staggered across the grid.
      gsap.set(tiles, {
        autoAlpha: 0,
        y: 64,
        scale: 0.9,
        rotateZ: (i: number) => (i % 2 ? 5 : -5),
        transformOrigin: '50% 100%',
      });

      const batch = ScrollTrigger.batch(tiles, {
        start: 'top 90%',
        onEnter: (group) =>
          gsap.to(group, {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            rotateZ: 0,
            duration: 0.7,
            ease: 'power3.out',
            stagger: 0.09,
            overwrite: true,
          }),
      });

      // Re-measure once lazy images settle (they change row heights/positions).
      const refresh = () => ScrollTrigger.refresh();
      const imgs = Array.from(grid.querySelectorAll('img'));
      imgs.forEach((img) => { if (!img.complete) img.addEventListener('load', refresh, { once: true }); });
      const t1 = window.setTimeout(refresh, 400);

      return () => {
        window.clearTimeout(t1);
        batch.forEach((st) => st.kill());
        gsap.set(tiles, { clearProps: 'all' });
      };
    },
    { scope: gridRef, dependencies: [cards.length] },
  );

  if (cards.length === 0) return null;

  return (
    <div className="glcards glcards--2" ref={gridRef}>
      {cards.map((c) => (
        <CardTile image={c.image} key={c.id} />
      ))}
    </div>
  );
}
