/*
 * Page transition control — runs inline in <head>, before the incoming page
 * is shown. The fade-and-rise itself is in src/styles/global.css.
 *
 * Only moves between work pages (home, disciplines, projects) animate. Moves
 * to Essays, About and Contact are instant. Adds `vt-cut` to <html> while a
 * work transition runs, so tests and styles can see it.
 */
(function () {
  var root = document.documentElement;

  function path(url) {
    try {
      var p = new URL(url, location.href);
      if (p.origin !== location.origin) return null;
      return p.pathname.replace(/\.html$/, '').replace(/\/index$/, '/').replace(/(.)\/$/, '$1');
    } catch (e) {
      return null;
    }
  }

  function isWork(p) {
    return p === '/' || p.indexOf('/work/') === 0 || p.indexOf('/projects/') === 0;
  }

  window.addEventListener('pagereveal', function (event) {
    var vt = event.viewTransition;
    if (!vt) return;

    var nav = /** @type {any} */ (window).navigation;
    var from = nav && nav.activation && nav.activation.from ? path(nav.activation.from.url) : null;
    var to = path(location.href);
    var reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduced || !from || !to || from === to || !isWork(from) || !isWork(to)) {
      vt.skipTransition();
      return;
    }

    root.classList.add('vt-cut');
    vt.finished.finally(function () {
      root.classList.remove('vt-cut');
    });
  });

  // Returning from the back/forward cache must never show a stale state.
  window.addEventListener('pageshow', function (event) {
    if (event.persisted) root.classList.remove('vt-cut');
  });
})();
