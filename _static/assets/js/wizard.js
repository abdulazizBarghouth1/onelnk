/* ==========================================================================
   wizard.js — step navigation for the "Create your card" wizard
   Progressive enhancement: without JS every panel is visible and the form
   still submits, so the page degrades to a long single-page form.
   ========================================================================== */

(function () {
  'use strict';

  var root = document.querySelector('[data-wizard]');
  if (!root) return;

  var panels = Array.prototype.slice.call(root.querySelectorAll('.wzpanel'));
  var markers = Array.prototype.slice.call(root.querySelectorAll('.wzstep'));
  if (!panels.length) return;

  var current = 0;

  function render() {
    panels.forEach(function (panel, i) {
      panel.hidden = i !== current;
    });

    // The confirmation panel has no rail step; flag the root so CSS hides it.
    var isFinal = panels[current].hasAttribute('data-final');
    if (isFinal) root.setAttribute('data-final', '');
    else root.removeAttribute('data-final');

    markers.forEach(function (marker, i) {
      // Every rail step reads as done once past the last numbered step.
      var state = isFinal || i < current ? 'done' : i === current ? 'current' : 'upcoming';
      marker.setAttribute('data-state', state);
      marker.setAttribute('aria-current', i === current ? 'step' : 'false');
    });

    // The rail scrolls on narrow screens; keep the active marker in view.
    if (markers[current] && markers[current].scrollIntoView) {
      markers[current].scrollIntoView({ block: 'nearest', inline: 'center' });
    }

    var back = panels[current].querySelector('.wznav__btn--back');
    if (back) back.disabled = current === 0;
  }

  function go(next) {
    if (next < 0 || next >= panels.length || next === current) return;
    current = next;
    render();
    // Land on the progress rail rather than mid-panel.
    root.scrollIntoView({ behavior: 'smooth', block: 'start' });
    history.replaceState(null, '', '#step-' + (current + 1));
  }

  root.addEventListener('click', function (event) {
    // Any element flagged data-wz-next advances (the nav button, and the
    // "Continue to Checkout" button inside the review summary).
    var next = event.target.closest('.wznav__btn--next, [data-wz-next]');
    if (next) {
      event.preventDefault();
      go(current + 1);
      return;
    }

    var back = event.target.closest('.wznav__btn--back');
    if (back) {
      event.preventDefault();
      go(current - 1);
      return;
    }

    // Quantity stepper (review step).
    var step = event.target.closest('[data-qty-inc], [data-qty-dec]');
    if (step) {
      event.preventDefault();
      var wrap = step.closest('.wzqty');
      var out = wrap.querySelector('output');
      var n = parseInt(out.textContent, 10) || 1;
      n = step.hasAttribute('data-qty-inc') ? n + 1 : Math.max(1, n - 1);
      out.textContent = n;
      var dec = wrap.querySelector('[data-qty-dec]');
      if (dec) dec.disabled = n <= 1;
      return;
    }

    // Completed steps are navigable; upcoming ones are not.
    var marker = event.target.closest('.wzstep');
    if (marker) {
      var index = markers.indexOf(marker);
      if (index > -1 && index < current) go(index);
    }
  });

  // Front/Back card preview switch.
  root.addEventListener('click', function (event) {
    var tab = event.target.closest('.preview__tab');
    if (!tab) return;
    var group = tab.parentNode;
    Array.prototype.forEach.call(group.querySelectorAll('.preview__tab'), function (t) {
      t.setAttribute('aria-selected', String(t === tab));
    });
  });

  // Deep link: #step-3 opens the third panel.
  var match = /^#step-(\d+)$/.exec(location.hash);
  if (match) {
    var wanted = parseInt(match[1], 10) - 1;
    if (wanted >= 0 && wanted < panels.length) current = wanted;
  }

  render();
})();
