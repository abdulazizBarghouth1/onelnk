import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import type { RefObject } from 'react';

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

/* One shared scroll-reveal vocabulary for EVERY marketing page (home + inner
   pages) — NOT a bespoke animation per section. Four roles:
     1. Section headings → split into WORDS that rise + fade (stagger).
     2. Grouped blocks (card grids / lists / text+media columns / intros) →
        children revealed via ScrollTrigger.batch, so each item animates when IT
        enters (tall lists animate row-by-row, not all at once).
     3. Standalone media placeholders → soft scale + fade.
     4. Standalone CTA buttons → fade up.

   Bilingual (EN/AR): we split by WORDS, never characters — char-splitting Arabic
   breaks the cursive joins. Word boundaries are spaces (metric-free, no FOUC),
   all motion is vertical (direction-neutral, no RTL casing), and the hook
   re-runs + reverts the splits on language change. See [[site-language-english]].

   The selector lists are the UNION of conventions across all pages; a page simply
   has no elements for the classes it doesn't use. Add a class here (one place) to
   cover a new section anywhere — never a per-page animation. */

const HEADING_SEL = [
  '.section-head__title', '.phead-block__title', '.phead__title',
  '.benefits__title', '.packages__title', '.industries__title', '.gallery__title',
  '.faq__title', '.faqgroup__title', '.split__title', '.why__title', '.quote__title',
  '.pd__title', '.corp__title', '.cform__title', '.bulk__title', '.brand__title',
].join(', ');

const GROUP_SEL = [
  '.section-head', '.phead-block', '.cform__head',
  '.trusted__grid', '.process__list', '.packages__grid', '.industries__grid',
  '.faq__list', '.faqnav__list', '.faqgroup__list', '.share__grid', '.compare__list',
  '.bcard__list', '.identity__card', '.cta__copy', '.cta__row', '.stage__grid',
  '.corp__grid', '.why__list', '.team__grid', '.tdash__list', '.qbb__grid',
  '.portal__list', '.brand__list', '.phead__actions', '.btn-row',
].join(', ');

const MEDIA_SEL = '.media-ph';

const BUTTON_SEL = '.benefits__cta';

/* Headings / buttons only skip the pinned hero + scroll-story + footer (a gallery
   heading lives inside .hgallery and SHOULD still animate). Block/media reveals
   additionally skip the self-animated gallery deck and sticky designer card. */
const LIGHT_EXCLUDE = '.hero, .hstory, .footer, footer';
const BLOCK_EXCLUDE = '.hero, .hstory, .hgallery, .glcards, .designer__card--sticky, .footer, footer';

export function usePageReveal(scope: RefObject<HTMLElement>, lang?: string) {
  useGSAP(
    () => {
      const root = scope.current;
      if (!root) return;
      if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;

      const splits: SplitText[] = [];
      const batches: ScrollTrigger[] = [];

      // 1 — Headings: word rise.
      root.querySelectorAll<HTMLElement>(HEADING_SEL).forEach((el) => {
        if (el.closest(LIGHT_EXCLUDE)) return;
        const split = new SplitText(el, { type: 'words', wordsClass: 'rv-word' });
        splits.push(split);
        gsap.set(split.words, { yPercent: 115, opacity: 0 });
        gsap.to(split.words, {
          yPercent: 0,
          opacity: 1,
          duration: 0.7,
          ease: 'back.out(1.4)',
          stagger: 0.03,
          scrollTrigger: { trigger: el, start: 'top 86%', once: true },
        });
      });

      // 2 — Grouped blocks: each child revealed as it enters (batch). Headings are
      // skipped (handled above); nested groups are skipped (parent handles them).
      root.querySelectorAll<HTMLElement>(GROUP_SEL).forEach((group) => {
        if (group.closest(BLOCK_EXCLUDE)) return;
        if (group.parentElement?.closest(GROUP_SEL)) return;
        const kids = Array.from(group.children).filter(
          (k) => !k.matches(HEADING_SEL),
        ) as HTMLElement[];
        if (!kids.length) return;
        gsap.set(kids, { y: 30, opacity: 0 });
        batches.push(
          ...ScrollTrigger.batch(kids, {
            start: 'top 90%',
            onEnter: (b) =>
              gsap.to(b, {
                y: 0,
                opacity: 1,
                duration: 0.6,
                ease: 'power3.out',
                stagger: 0.08,
                overwrite: true,
              }),
          }),
        );
      });

      // 3 — Standalone media (ones inside a group ride the group reveal).
      root.querySelectorAll<HTMLElement>(MEDIA_SEL).forEach((m) => {
        if (m.closest(BLOCK_EXCLUDE) || m.closest(GROUP_SEL)) return;
        gsap.set(m, { scale: 0.94, opacity: 0, transformOrigin: '50% 60%' });
        gsap.to(m, {
          scale: 1,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: { trigger: m, start: 'top 85%', once: true },
        });
      });

      // 4 — Standalone CTA buttons (ones inside a group ride the group reveal).
      root.querySelectorAll<HTMLElement>(BUTTON_SEL).forEach((btn) => {
        if (btn.closest(LIGHT_EXCLUDE) || btn.closest(GROUP_SEL)) return;
        gsap.set(btn, { y: 20, opacity: 0 });
        gsap.to(btn, {
          y: 0,
          opacity: 1,
          duration: 0.55,
          ease: 'power3.out',
          scrollTrigger: { trigger: btn, start: 'top 92%', once: true },
        });
      });

      // Trigger start positions depend on the final page height, which keeps
      // changing after this runs (pinned sections, lazy images/fonts). Recompute
      // once everything settles, or triggers point at the wrong offset.
      const refresh = () => ScrollTrigger.refresh();
      refresh();
      window.addEventListener('load', refresh);
      document.fonts?.ready.then(refresh).catch(() => {});
      const imgs = Array.from(root.querySelectorAll('img'));
      imgs.forEach((img) => { if (!img.complete) img.addEventListener('load', refresh, { once: true }); });
      const t1 = window.setTimeout(refresh, 400);
      const t2 = window.setTimeout(refresh, 1400);

      return () => {
        window.removeEventListener('load', refresh);
        window.clearTimeout(t1);
        window.clearTimeout(t2);
        batches.forEach((b) => b.kill());
        splits.forEach((s) => s.revert());
      };
    },
    { scope, dependencies: [lang] },
  );
}
