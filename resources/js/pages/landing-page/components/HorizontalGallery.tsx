import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

export interface GalleryItemData {
  id: number | string;
  image: string;
}

interface Props {
  items: GalleryItemData[];
  /** Used when there are no admin-uploaded items yet. */
  fallback?: string[];
}

/**
 * GSAP horizontal-scrolling gallery (à la demos.gsap.com/demo/horizontal-scrolling-gallery).
 * The section pins while vertical scroll translates the card track sideways.
 * Falls back to a plain horizontal strip when reduced-motion is requested, the
 * track fits without scrolling, or GSAP can't measure (SSR / hidden).
 */
export default function HorizontalGallery({ items, fallback = [] }: Props) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const cards = items.length > 0 ? items : fallback.map((image, i) => ({ id: `fb-${i}`, image }));

  useGSAP(
    () => {
      const section = sectionRef.current;
      const track = trackRef.current;
      if (!section || !track) return;

      const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
      if (reduce) return; // plain overflow strip (CSS) — no pin/scrub

      const getAmount = () => Math.max(0, track.scrollWidth - section.offsetWidth);
      if (getAmount() <= 0) return; // fits on screen → no horizontal scroll needed

      // Switch off the fallback internal scroll while GSAP drives the transform.
      section.classList.add('hgallery--pinned');

      const tween = gsap.to(track, {
        x: () => -getAmount(),
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => '+=' + getAmount(),
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      });

      // The homepage is long and images ABOVE the gallery load late, shifting
      // layout and staling the pin's cached scroll positions. Recompute once
      // everything (images/fonts) settles so the pin fires at the right offset.
      const refresh = () => ScrollTrigger.refresh();
      const imgs = Array.from(track.querySelectorAll('img'));
      imgs.forEach((img) => { if (!img.complete) img.addEventListener('load', refresh, { once: true }); });
      window.addEventListener('load', refresh);
      // Fonts (Archivo) swap in after first paint and shift vertical layout,
      // staling the pin's cached positions — recompute once they're ready.
      document.fonts?.ready.then(refresh).catch(() => {});
      const t = window.setTimeout(refresh, 600);

      return () => {
        window.clearTimeout(t);
        window.removeEventListener('load', refresh);
        tween.scrollTrigger?.kill();
        tween.kill();
        section.classList.remove('hgallery--pinned');
      };
    },
    { scope: sectionRef, dependencies: [cards.length] },
  );

  if (cards.length === 0) return null;

  return (
    <div className="hgallery" ref={sectionRef}>
      <div className="hgallery__track" ref={trackRef}>
        {cards.map((c) => (
          <div className="hgallery__card" key={c.id}>
            <img src={c.image} alt="" loading="lazy" />
          </div>
        ))}
      </div>
    </div>
  );
}
