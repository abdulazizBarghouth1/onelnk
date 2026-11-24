import type { RefObject } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

/**
 * Magnetic + directional "liquid fill" hover for icon buttons (social links).
 *
 * Markup per item (inside `scope`):
 *   <a className="mfx">
 *     <span className="mfx__fill" aria-hidden="true" />
 *     <img className="mfx__icon" ... />
 *   </a>
 *
 * - Magnetic: the button leans toward the cursor and the icon leans further
 *   (parallax), then springs back with an elastic ease on leave.
 * - Fill: a brand-ember circle grows from the exact point the cursor entered and
 *   drains out toward the point it left. Styles live in onelnk-landing.css (.mfx).
 *
 * Mouse/trackpad only (no hover on touch). Under prefers-reduced-motion the
 * magnetic pull is skipped and the fill just fades.
 */
export function useMagneticFill(scope: RefObject<HTMLElement | null>, selector = '.mfx') {
  useGSAP(
    () => {
      const root = scope.current;
      if (!root || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      const items = Array.from(root.querySelectorAll<HTMLElement>(selector));
      const offs = items.map((el) => {
        const fill = el.querySelector<HTMLElement>('.mfx__fill');
        const icon = el.querySelector<HTMLElement>('.mfx__icon');
        if (!fill) return () => {};
        gsap.set(fill, { xPercent: -50, yPercent: -50, scale: 0 });

        // Pointer position in the button's own (untransformed) box, so the
        // magnetic offset doesn't feed back into the next measurement.
        const local = (e: MouseEvent) => {
          const r = el.getBoundingClientRect();
          const left = r.left - Number(gsap.getProperty(el, 'x'));
          const top = r.top - Number(gsap.getProperty(el, 'y'));
          return { x: e.clientX - left, y: e.clientY - top, w: r.width, h: r.height };
        };

        const enter = (e: MouseEvent) => {
          const p = local(e);
          // Diameter big enough to cover the far corner from any edge point.
          const size = 2 * Math.hypot(p.w, p.h);
          el.classList.add('is-hot');
          if (reduce) {
            gsap.set(fill, { left: p.w / 2, top: p.h / 2, width: size, height: size, scale: 1, opacity: 0 });
            gsap.to(fill, { opacity: 1, duration: 0.2, overwrite: 'auto' });
            return;
          }
          gsap.set(fill, { left: p.x, top: p.y, width: size, height: size, opacity: 1 });
          gsap.fromTo(fill, { scale: 0 }, { scale: 1, duration: 0.55, ease: 'power3.out', overwrite: 'auto' });
          if (icon) gsap.fromTo(icon, { scale: 0.85 }, { scale: 1, duration: 0.6, ease: 'back.out(3)' });
        };

        const move = (e: MouseEvent) => {
          if (reduce) return;
          const p = local(e);
          const dx = p.x - p.w / 2;
          const dy = p.y - p.h / 2;
          gsap.to(el, { x: dx * 0.35, y: dy * 0.35, duration: 0.4, ease: 'power3.out', overwrite: 'auto' });
          if (icon) gsap.to(icon, { x: dx * 0.2, y: dy * 0.2, duration: 0.4, ease: 'power3.out', overwrite: 'auto' });
        };

        const leave = (e: MouseEvent) => {
          el.classList.remove('is-hot');
          if (reduce) {
            gsap.to(fill, { opacity: 0, duration: 0.2, overwrite: 'auto' });
            return;
          }
          const p = local(e);
          // Drain toward the exit point.
          gsap.to(fill, { left: p.x, top: p.y, scale: 0, duration: 0.45, ease: 'power3.in', overwrite: 'auto' });
          gsap.to([el, icon].filter(Boolean), { x: 0, y: 0, duration: 1, ease: 'elastic.out(1, 0.35)', overwrite: 'auto' });
        };

        el.addEventListener('mouseenter', enter);
        el.addEventListener('mousemove', move);
        el.addEventListener('mouseleave', leave);
        return () => {
          el.removeEventListener('mouseenter', enter);
          el.removeEventListener('mousemove', move);
          el.removeEventListener('mouseleave', leave);
        };
      });

      return () => offs.forEach((off) => off());
    },
    { scope },
  );
}
