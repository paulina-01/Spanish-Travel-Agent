/* Registers the service worker — enables PWA install + offline shell.
   Loaded on index.html, app.html, and Splash-draftv3-parrot.html.
   Registration resolves 'sw.js' relative to the page (site root), so the
   worker's scope covers the whole site. */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function () {
    navigator.serviceWorker.register('sw.js').catch(function (err) {
      console.warn('[sw] registration failed:', err);
    });
  });
}
