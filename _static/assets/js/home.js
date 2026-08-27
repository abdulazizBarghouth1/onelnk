/* ==========================================================================
   home.js — Home page behaviour
   Plain ES5-compatible JS, no dependencies, no build step.
   ========================================================================== */

(function () {
  'use strict';

  /* ---- Nav menu toggle ------------------------------------------------ */

  var menuBtn = document.querySelector('.hero__menu-btn');

  if (menuBtn) {
    menuBtn.addEventListener('click', function () {
      var expanded = menuBtn.getAttribute('aria-expanded') === 'true';
      menuBtn.setAttribute('aria-expanded', expanded ? 'false' : 'true');
      // Menu panel is not in the Figma home frame yet — wire up the target
      // element here once that design exists.
    });
  }
})();
