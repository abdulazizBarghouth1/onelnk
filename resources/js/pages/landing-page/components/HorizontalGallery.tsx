import { ReactNode, useRef } from 'react';
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
  /** Rendered inside the pinned panel, above the track (typically the heading). */
  header?: ReactNode;
  /** Rendered inside the pinned panel, below the track (typically the CTA). */
  footer?: ReactNode;
}

/**
 * GSAP horizontal-scrolling gallery (à la demos.gsap.com/demo/horizontal-scrolling-gallery).
 *
 * Robust "sticky + runway" technique instead of ScrollTrigger's `pin`:
 *  - the section is made as tall as (panel height + horizontal overflow) so
 *    scrolling through it provides the runway,
 *  - a native `position: sticky` inner holds the viewport in place (immune to
 *    flex parents / pin-spacer / pinType quirks that broke the pin approach),
 *  - ScrollTrigger only scrubs the track's x from 0 → -overflow.
 *
 * Falls back to a plain horizontal-scroll strip under reduced-motion, when the
 * track already fits, or when JS is unavailable.
 */
export default function HorizontalGallery({ items, fallback = [], header, footer }: Props) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const cards = items.length > 0 ? items : fallback.map((image, i) => ({ id: `fb-${i}`, image }));

  useGSAP(
    () => {
      const section = sectionRef.current;
      const sticky = stickyRef.current;
      const track = trackRef.current;
      if (!section || !sticky || !track) return;
      if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;

      // How far the track overflows the viewport = the horizontal scroll amount.
      const overflow = () => Math.max(0, track.scrollWidth - window.innerWidth);
      if (overflow() <= 0) return; // fits on screen → keep the fallback strip

      section.classList.add('hgallery--active');
      // Section height = sticky panel height + the horizontal overflow. The sticky
      // stays pinned for exactly `overflow` px of scroll, so the scrub (also driven
      // over `overflow`) stays in sync no matter how tall the sticky panel is.
      const setHeight = () => { section.style.height = sticky.offsetHeight + overflow() + 'px'; };
      setHeight();

      const foot = section.querySelector<HTMLElement>('.hgallery__foot');

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => '+=' + overflow(),
          scrub: 1,
          invalidateOnRefresh: true,
          onRefresh: setHeight,
        },
      });
      tl.to(track, { x: () => -overflow(), ease: 'none', duration: 1 }, 0);
      // The CTA rises into place over the last 15% of the scrub - i.e. exactly
      // as the final card arrives - and sinks again on the way back up.
      // `autoAlpha` (not `display`) keeps its 48px in the layout throughout, so
      // the panel height `setHeight` measures never moves under the trigger.
      if (foot) {
        tl.fromTo(
          foot,
          { autoAlpha: 0, y: 28 },
          { autoAlpha: 1, y: 0, ease: 'power2.out', duration: 0.15 },
          0.85,
        );
      }

      // Recompute once late-loading images/fonts settle (they shift widths).
      const refresh = () => { setHeight(); ScrollTrigger.refresh(); };
      const imgs = Array.from(track.querySelectorAll('img'));
      imgs.forEach((img) => { if (!img.complete) img.addEventListener('load', refresh, { once: true }); });
      window.addEventListener('load', refresh);
      document.fonts?.ready.then(refresh).catch(() => {});
      const t1 = window.setTimeout(refresh, 300);
      const t2 = window.setTimeout(refresh, 1200);

      return () => {
        window.clearTimeout(t1);
        window.clearTimeout(t2);
        window.removeEventListener('load', refresh);
        tl.scrollTrigger?.kill();
        tl.kill();
        if (foot) gsap.set(foot, { clearProps: 'opacity,visibility,transform' });
        section.classList.remove('hgallery--active');
        section.style.height = '';
      };
    },
    { scope: sectionRef, dependencies: [cards.length] },
  );

  if (cards.length === 0) return null;

  return (
    <div className="hgallery" ref={sectionRef}>
      {/* `header` / `footer` live INSIDE the pinned panel on purpose: outside it
          they sat beyond the panel's slack, which read as a ~200px void between
          the heading and the cards. In here the group is one block parked under
          the nav, and the CTA stays beside the cards for the entire scrub. */}
      <div className="hgallery__sticky" ref={stickyRef}>
        {header && <div className="hgallery__head">{header}</div>}
        <div className="hgallery__track" ref={trackRef}>
          {cards.map((c) => (
            <div className="hgallery__card" key={c.id}>
              <img src={c.image} alt="" />
            </div>
          ))}
        </div>
        {footer && <div className="hgallery__foot">{footer}</div>}
      </div>
    </div>
  );
}
