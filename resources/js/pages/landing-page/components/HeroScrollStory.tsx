import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import PhysicalCard from '../../create-card/components/PhysicalCard';
import '../../../../css/onelnk-hero-story.css';
// PhysicalCard's own `.pcard*` styles live in the wizard sheet (scoped to .onelnk-wizard).
import '../../../../css/onelnk-wizard-live.css';

gsap.registerPlugin(ScrollTrigger, useGSAP);
// Phones resize the viewport when the address bar hides/shows. Without this the
// pinned panel refreshes and jumps mid-scroll.
ScrollTrigger.config({ ignoreMobileResize: true });

/** The person the story tells — one identity across the card, notification and profile. */
const PERSON = {
  name: 'Abdulrahman Al-Qahtani',
  first: 'Abdulrahman',
  phone: '+966 55 123 4567',
  email: 'abdulrahman@onelnk.sa',
  location: 'Riyadh, Saudi Arabia',
  website: 'onelnk.sa/abdulrahman',
  avatar: '/images/onelnk/hero-avatar.jpg',
};

/* Inline icons — tiny and colour-inheriting, so they stay crisp inside the phone. */
const sIco = { width: '1em', height: '1em', display: 'block' } as const;
const IcoPhone = () => (
  <svg viewBox="0 0 24 24" style={sIco} fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/></svg>
);
const IcoMail = () => (
  <svg viewBox="0 0 24 24" style={sIco} fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><rect x="2.5" y="4.5" width="19" height="15" rx="2.5"/><path d="m3 7 8.1 5.4a2 2 0 0 0 2.2 0L21 7"/></svg>
);
const IcoPin = () => (
  <svg viewBox="0 0 24 24" style={sIco} fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 5.4-8 12-8 12s-8-6.6-8-12a8 8 0 1 1 16 0z"/><circle cx="12" cy="10" r="2.8"/></svg>
);
const IcoGlobe = () => (
  <svg viewBox="0 0 24 24" style={sIco} fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a15 15 0 0 1 0 18 15 15 0 0 1 0-18z"/></svg>
);
const IcoWhatsapp = () => (
  <svg viewBox="0 0 24 24" style={sIco} fill="currentColor"><path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.64.08-.3-.15-1.26-.47-2.4-1.48-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.35.44-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.87 1.22 3.07c.15.2 2.1 3.2 5.08 4.49.7.3 1.26.49 1.69.62.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2-1.42.25-.69.25-1.28.18-1.41-.08-.12-.28-.2-.57-.35M12.05 21.78h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.26C2.17 6.44 6.6 2 12.05 2c2.64 0 5.12 1.03 6.99 2.9a9.83 9.83 0 0 1 2.89 6.99c0 5.45-4.44 9.89-9.88 9.89"/></svg>
);
const IcoLinkedin = () => (
  <svg viewBox="0 0 24 24" style={sIco} fill="currentColor"><path d="M6.94 5a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM3.2 8.6h3.5V21H3.2V8.6zm6.4 0h3.35v1.7h.05a3.67 3.67 0 0 1 3.3-1.82c3.53 0 4.2 2.33 4.2 5.35V21h-3.5v-5.5c0-1.31-.02-3-1.83-3-1.83 0-2.11 1.43-2.11 2.9V21H9.6V8.6z"/></svg>
);
const IcoX = () => (
  <svg viewBox="0 0 24 24" style={sIco} fill="currentColor"><path d="M17.53 3H20l-5.4 6.17L21 21h-5.1l-4-5.23L7.3 21H4.83l5.78-6.6L3.5 3h5.23l3.6 4.76L17.53 3zm-.87 16.2h1.37L8.4 4.72H6.93l9.73 14.48z"/></svg>
);
const IcoInstagram = () => (
  <svg viewBox="0 0 24 24" style={sIco} fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none"/></svg>
);

/** The only values that differ between the two modes: how far the card travels. */
interface Geo {
  inX: number; inY: number; inRot: number; inScale: number;
  restX: number;
  tuckX: number; tuckY: number; tuckScale: number;
  endX: number; endY: number; endScale: number;
}

/**
 * Homepage scroll story — sits directly under the hero and tells the product in
 * one sequence: the NFC card flies in, slides behind the phone, taps, a
 * notification drops, it gets tapped, and the digital profile opens.
 *
 * Pinned and scrubbed at every width: the sticky panel holds still while the
 * beats follow the scrollbar, in both directions. Pinning uses the "sticky +
 * runway" technique from HorizontalGallery (a CSS `position: sticky` panel in a
 * tall section, with ScrollTrigger only scrubbing) — ScrollTrigger's own `pin`
 * fights this project's flex layouts. Only the card's travel and the runway
 * length differ between wide and narrow screens.
 *
 * Under reduced motion or without JS neither class lands, and the CSS static
 * fallback shows the finished frame — phone with the profile open, card beside it.
 */
export default function HeroScrollStory() {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const sticky = stickyRef.current;
      if (!section || !sticky) return;

      const els = () => {
        const q = gsap.utils.selector(section);
        return {
          card: q('.hstory__card')[0],
          phone: q('.hstory__phone')[0],
          glow: q('.hstory__glow')[0],
          ripples: q('.hstory__ripple'),
          notif: q('.hstory__notif')[0],
          tap: q('.hstory__tap')[0],
          home: q('.hstory__home')[0],
          profile: q('.hstory__profile')[0],
          psave: q('.hstory__psave')[0],
          ptap: q('.hstory__ptap')[0],
          contacts: q('.hstory__contacts')[0],
          crow: q('.hstory__crow')[0],
          cnew: q('.hstory__cnew')[0],
          cname: q('.hstory__cname')[0],
          caps: q('.hstory__cap'),
        };
      };

      /**
       * Shared beats. Durations are timeline units: seconds when the timeline
       * plays (mobile), normalised across the runway when scrubbed (desktop).
       */
      const buildTimeline = (e: ReturnType<typeof els>, geo: Geo, paused: boolean) => {
        const { card, phone, glow, ripples, notif, tap, home, profile, psave, ptap, contacts, crow, cnew, cname, caps } = e;

        gsap.set(card, { xPercent: geo.inX, yPercent: geo.inY, rotate: geo.inRot, scale: geo.inScale, opacity: 0 });
        // The phone is the anchor: it sits at rest under the hero CTAs before any
        // scrolling, so the section never loads looking empty. Only the card flies in.
        gsap.set(phone, { yPercent: 0, scale: 1, opacity: 1 });
        gsap.set(glow, { opacity: 0, scale: 0.6 });
        gsap.set(ripples, { opacity: 0, scale: 0.2 });
        gsap.set(notif, { y: -70, opacity: 0, scale: 1 });
        gsap.set(tap, { opacity: 0, scale: 0.4 });
        gsap.set(home, { opacity: 1 });
        gsap.set(profile, { yPercent: 12, xPercent: 0, opacity: 0 });
        gsap.set(psave, { scale: 1 });
        gsap.set(ptap, { opacity: 0, scale: 0.4 });
        // The contact list waits just off the right edge of the screen.
        gsap.set(contacts, { xPercent: 100, opacity: 1 });
        // The saved row takes no space until it opens a slot for itself.
        gsap.set(cnew, { height: 0, marginBottom: 0, opacity: 0, xPercent: 65 });
        gsap.set(cname, { opacity: 0, x: 10 });
        gsap.set(caps, { opacity: 0, y: 16 });
        // First caption reads at rest too, for the same reason.
        gsap.set(caps[0], { opacity: 1, y: 0 });

        // The slot the new row opens must match the placeholder rows exactly.
        const rowGap = crow ? parseFloat(getComputedStyle(crow).marginBottom) || 0 : 0;
        const rowH = crow ? crow.getBoundingClientRect().height : 0;

        const tl = gsap.timeline({ defaults: { ease: 'none' }, paused });

        tl
          // 1 — card and phone arrive
          .to(card, { xPercent: geo.restX, yPercent: 0, rotate: -9, scale: 1, opacity: 1, duration: 1.1, ease: 'power2.out' }, 0)

          // 2 — the card slides in behind the phone
          .to(caps[0], { opacity: 0, y: -16, duration: 0.4 }, 1.35)
          .to(caps[1], { opacity: 1, y: 0, duration: 0.5 }, 1.7)
          .to(card, { xPercent: geo.tuckX, yPercent: geo.tuckY, rotate: -3, scale: geo.tuckScale, duration: 1.5, ease: 'power1.inOut' }, 1.3)

          // 3 — NFC contact: glow + three expanding rings
          .to(glow, { opacity: 1, scale: 1, duration: 0.5 }, 2.6)
          .to(ripples, {
            opacity: 0.55, scale: 1, duration: 0.9, ease: 'power2.out',
            stagger: { each: 0.22, from: 'start' },
          }, 2.7)
          .to(ripples, { opacity: 0, duration: 0.5, stagger: { each: 0.22, from: 'start' } }, 3.2)

          // 4 — the notification drops in
          .to(caps[1], { opacity: 0, y: -16, duration: 0.4 }, 3.5)
          .to(caps[2], { opacity: 1, y: 0, duration: 0.5 }, 3.85)
          .to(notif, { y: 0, opacity: 1, duration: 0.7, ease: 'back.out(1.5)' }, 3.6)
          .to(glow, { opacity: 0, duration: 0.5 }, 3.8)

          // 5 — it gets tapped
          .to(tap, { opacity: 1, scale: 1, duration: 0.25, ease: 'power2.out' }, 4.6)
          .to(notif, { scale: 0.96, duration: 0.18 }, 4.72)
          .to(notif, { scale: 1, duration: 0.2 }, 4.9)
          .to(tap, { opacity: 0, scale: 1.5, duration: 0.3 }, 4.9)
          .to(notif, { y: -48, opacity: 0, duration: 0.45, ease: 'power2.in' }, 5.05)

          // 6 — the profile opens
          .to(home, { opacity: 0, duration: 0.35 }, 5.05)
          .to(profile, { yPercent: 0, opacity: 1, duration: 0.95, ease: 'power2.out' }, 5.2)
          .to(phone, { scale: 1.05, duration: 0.95, ease: 'power2.out' }, 5.2)
          .to(card, { xPercent: geo.endX, yPercent: geo.endY, rotate: -7, scale: geo.endScale, duration: 0.95, ease: 'power2.out' }, 5.2)
          .to(caps[2], { opacity: 0, y: -16, duration: 0.4 }, 5.35)
          .to(caps[3], { opacity: 1, y: 0, duration: 0.5 }, 5.7)

          // 7 — the Save Contact button gets tapped
          .to(ptap, { opacity: 1, scale: 1, duration: 0.25, ease: 'power2.out' }, 6.35)
          .to(psave, { scale: 0.95, duration: 0.16 }, 6.47)
          .to(psave, { scale: 1, duration: 0.22, ease: 'back.out(2)' }, 6.63)
          .to(ptap, { opacity: 0, scale: 1.6, duration: 0.3 }, 6.6)

          // 8 — the screen pushes across to their contact list
          .to(caps[3], { opacity: 0, y: -16, duration: 0.4 }, 6.8)
          .to(caps[4], { opacity: 1, y: 0, duration: 0.5 }, 7.15)
          .to(profile, { xPercent: -26, opacity: 0.3, duration: 0.6, ease: 'power2.inOut' }, 6.9)
          .to(contacts, { xPercent: 0, duration: 0.6, ease: 'power2.inOut' }, 6.9)

          // 9 — the saved contact opens a slot, slides in among the others and
          //     only then shows its name
          .to(cnew, { height: rowH, marginBottom: rowGap, duration: 0.38, ease: 'power2.out' }, 7.6)
          .to(cnew, { xPercent: 0, opacity: 1, duration: 0.55, ease: 'back.out(1.35)' }, 7.85)
          .to(cname, { opacity: 1, x: 0, duration: 0.4, ease: 'power2.out' }, 8.2)

          // 10 — hold the finished frame before the panel releases
          .to({}, { duration: 0.9 });

        return tl;
      };

      /**
       * Pin + scrub. Identical at every width (the sticky panel holds still
       * while the beats follow the scrollbar, forwards and backwards) — only
       * the card's travel and the runway length change.
       */
      const setupScrub = (geo: Geo, screens: number) => {
        const e = els();
        if (!e.card || !e.phone) return;
        section.classList.add('hstory--scrub');

        // Section height = sticky panel + travel, so the panel releases exactly
        // as the timeline finishes.
        const travel = () => Math.round(window.innerHeight * screens);
        const setHeight = () => { section.style.height = sticky.offsetHeight + travel() + 'px'; };
        setHeight();

        const tl = buildTimeline(e, geo, false);
        const st = ScrollTrigger.create({
          animation: tl,
          trigger: section,
          start: 'top top',
          end: () => '+=' + travel(),
          scrub: 1,
          invalidateOnRefresh: true,
          onRefresh: setHeight,
        });

        // Late-loading fonts/images shift the sticky panel's height → re-measure.
        const refresh = () => { setHeight(); ScrollTrigger.refresh(); };
        window.addEventListener('load', refresh);
        document.fonts?.ready.then(refresh).catch(() => {});
        const t1 = window.setTimeout(refresh, 400);
        const t2 = window.setTimeout(refresh, 1400);

        return () => {
          window.clearTimeout(t1);
          window.clearTimeout(t2);
          window.removeEventListener('load', refresh);
          st.kill();
          tl.kill();
          section.classList.remove('hstory--scrub');
          section.style.height = '';
        };
      };

      const mm = gsap.matchMedia();

      mm.add('(min-width: 1025px) and (prefers-reduced-motion: no-preference)', () => setupScrub({
        inX: -150, inY: 20, inRot: -18, inScale: 1.1,
        restX: -62, tuckX: -8, tuckY: 7, tuckScale: 0.74,
        endX: -20, endY: 17, endScale: 0.66,
      }, 3.1));

      // Narrow screens: the card starts just off the edge and tucks almost fully
      // behind the phone, and the runway is shorter so the hold feels the same.
      mm.add('(max-width: 1024px) and (prefers-reduced-motion: no-preference)', () => setupScrub({
        inX: -118, inY: 26, inRot: -16, inScale: 1.04,
        restX: -46, tuckX: -6, tuckY: 6, tuckScale: 0.78,
        endX: -14, endY: 13, endScale: 0.72,
      }, 2.7));

      return () => mm.revert();
    },
    { scope: sectionRef },
  );

  // One caption per beat, stacked and cross-faded by the timeline (no text
  // swapping, so nothing reflows mid-sequence).
  const captions = [
    { k: t('Your card'), v: t('A premium NFC card, designed your way.') },
    { k: t('One tap'), v: t('Hold it near any phone. No app, no setup.') },
    { k: t('It just appears'), v: t('Your profile arrives as a notification.') },
    { k: t('Connected'), v: t('Your full digital profile opens instantly.') },
    { k: t('Saved'), v: t('One tap and you are in their contacts — for good.') },
  ];

  return (
    <div className="onelnk-landing onelnk-wizard">
      <section className="hstory" ref={sectionRef} aria-label={t('How OneLnk works')}>
        <div className="hstory__sticky" ref={stickyRef}>
          <div className="hstory__stage">
            {/* Scene — card and phone stacked on one grid cell, both centred. */}
            <div className="hstory__scene">
              <div className="hstory__card">
                <PhysicalCard
                  name={PERSON.name}
                  title={t('Senior Product Designer')}
                  phone="+966 55 123 4567"
                  preset="onyx"
                />
              </div>

              <div className="hstory__phone">
                <div className="hstory__glow" aria-hidden="true" />
                <span className="hstory__ripple" aria-hidden="true" />
                <span className="hstory__ripple" aria-hidden="true" />
                <span className="hstory__ripple" aria-hidden="true" />

                <div className="hstory__screen">
                  {/* Idle lock screen, before the tap */}
                  <div className="hstory__home" aria-hidden="true">
                    <p className="hstory__clock">9:41</p>
                    <p className="hstory__date">{t('Tuesday, 14 October')}</p>
                  </div>

                  {/* The incoming notification */}
                  <div className="hstory__notif" aria-hidden="true">
                    <span className="hstory__notif-icon">
                      <img src="/images/onelnk/s3-logo-icon.svg" alt="" />
                    </span>
                    <span className="hstory__notif-body">
                      <b>OneLnk</b>
                      <span>{t('Abdulrahman shared a card')}</span>
                    </span>
                  </div>
                  <span className="hstory__tap" aria-hidden="true" />

                  {/* The profile that opens */}
                  <div className="hstory__profile" aria-hidden="true">
                    <div className="hstory__pcover" />
                    <div className="hstory__pavatar">
                      <img src={PERSON.avatar} alt="" />
                    </div>
                    <p className="hstory__pname">{PERSON.name}</p>
                    <p className="hstory__prole">{t('Business Development Manager')}</p>
                    <p className="hstory__psave">
                      {t('Save Contact')}
                      <span className="hstory__ptap" aria-hidden="true" />
                    </p>
                    <div className="hstory__prows">
                      <span className="hstory__prow"><i><IcoPhone /></i>{PERSON.phone}</span>
                      <span className="hstory__prow"><i><IcoMail /></i>{PERSON.email}</span>
                      <span className="hstory__prow"><i><IcoPin /></i>{PERSON.location}</span>
                      <span className="hstory__prow"><i><IcoGlobe /></i>{PERSON.website}</span>
                    </div>
                    <div className="hstory__psocials">
                      <span className="hstory__psoc"><IcoWhatsapp /></span>
                      <span className="hstory__psoc"><IcoLinkedin /></span>
                      <span className="hstory__psoc"><IcoX /></span>
                      <span className="hstory__psoc"><IcoInstagram /></span>
                    </div>
                  </div>

                  {/* Their contact list — the saved card slides into place */}
                  <div className="hstory__contacts" aria-hidden="true">
                    <p className="hstory__ctitle">{t('Contacts')}</p>
                    <div className="hstory__clist">
                      <span className="hstory__crow" />
                      <span className="hstory__crow" />
                      <span className="hstory__cnew">
                        <span className="hstory__cavatar"><img src={PERSON.avatar} alt="" /></span>
                        <span className="hstory__cname">{PERSON.name}</span>
                      </span>
                      <span className="hstory__crow" />
                      <span className="hstory__crow" />
                      <span className="hstory__crow" />
                    </div>
                  </div>
                </div>

                <span className="hstory__notch" aria-hidden="true" />
              </div>
            </div>

            {/* Captions */}
            <div className="hstory__copy">
              {captions.map((c, i) => (
                <div className="hstory__cap" key={i} aria-hidden={i > 0 ? 'true' : undefined}>
                  <p className="hstory__cap-k">{c.k}</p>
                  <p className="hstory__cap-v">{c.v}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
