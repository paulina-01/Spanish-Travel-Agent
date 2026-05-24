/*
 * Module completion popups — loader & controller.
 *
 * Usage in your main page:
 *   <link rel="stylesheet" href="styles/popups.css">
 *   <script src="js/popups.js" defer></script>
 *   <div id="popup-host"></div>
 *
 * Then from anywhere:
 *   showPopup('m0');   // shows modules/popups/m0-complete.html
 *   hidePopup();       // closes the current popup
 *
 * The popup HTML may include data-action="next" / data-action="review" /
 * data-action="dismiss" on its buttons — they're wired automatically.
 * Override default next-module navigation by setting POPUP_ROUTES below.
 */

const POPUP_ROUTES = {
  m0:  { next: 'm1',  reviewUrl: 'modules/m0-sound-like-spanish.html', nextUrl: 'modules/m1-who-are-you.html' },
  m1:  { next: 'm2',  reviewUrl: 'modules/m1-who-are-you.html',        nextUrl: 'modules/m2-going-places.html' },
  m2:  { next: 'm4',  reviewUrl: 'modules/m2-going-places.html',       nextUrl: 'modules/m4-day-in-life.html' },
  m4:  { next: 'm8',  reviewUrl: 'modules/m4-day-in-life.html',        nextUrl: 'modules/m8-para-vs-por.html' },
  m8:  { next: 'm12', reviewUrl: 'modules/m8-para-vs-por.html',        nextUrl: 'modules/m12-subjunctive.html' },
  m12: { next: 'm16', reviewUrl: 'modules/m12-subjunctive.html',       nextUrl: 'modules/m16-poetry-song-culture.html' },
};

const popupCache = {};
let currentModule = null;

async function showPopup(moduleId) {
  const host = document.getElementById('popup-host');
  if (!host) { console.warn('[popups] no #popup-host element found'); return; }

  // Lazy-load the HTML
  if (!popupCache[moduleId]) {
    try {
      const res = await fetch(`modules/popups/${moduleId}-complete.html`);
      popupCache[moduleId] = await res.text();
    } catch (e) {
      console.error(`[popups] failed to load ${moduleId}`, e);
      return;
    }
  }

  host.innerHTML = `<div class="popup-scrim" data-action="dismiss">${popupCache[moduleId]}</div>`;
  const scrim = host.firstElementChild;
  // Force reflow so the .is-open transition runs
  void scrim.offsetWidth;
  scrim.classList.add('is-open');
  currentModule = moduleId;

  // Wire actions
  scrim.addEventListener('click', handlePopupClick);
  document.addEventListener('keydown', handleEsc);
}

function hidePopup() {
  const scrim = document.querySelector('.popup-scrim');
  if (!scrim) return;
  scrim.classList.remove('is-open');
  document.removeEventListener('keydown', handleEsc);
  setTimeout(() => { scrim.remove(); }, 280);
  currentModule = null;
}

function handlePopupClick(e) {
  const action = e.target.closest('[data-action]')?.dataset.action;
  if (!action) return;
  // Ignore clicks on the popup itself unless it explicitly has data-action
  if (action === 'dismiss' && e.target.closest('.popup')) return;

  const route = POPUP_ROUTES[currentModule] || {};
  switch (action) {
    case 'next':    if (route.nextUrl)   window.location.href = route.nextUrl; break;
    case 'review':  if (route.reviewUrl) window.location.href = route.reviewUrl; break;
    case 'dismiss': hidePopup(); break;
  }
}

function handleEsc(e) {
  if (e.key === 'Escape') hidePopup();
}

// Expose globally
window.showPopup = showPopup;
window.hidePopup = hidePopup;
