/*
 * Signature cut-and-reveal — runs inline in <head> so it is registered
 * before the browser fires `pagereveal` on the incoming page.
 *
 * Cross-document view transitions are enabled in CSS (@view-transition).
 * Here we decide, per navigation, whether the transition is a "cut"
 * (between the homepage, disciplines and projects) or should be skipped
 * so the page simply appears. The browser owns history, URLs and
 * interruption: a new click aborts a running transition cleanly, and no
 * overlay ever lives in the DOM outside the transition itself.
 */
(function () {
  var root = document.documentElement;
  var settleTimer;

  function normalise(url) {
    try {
      var p = new URL(url, location.href);
      if (p.origin !== location.origin) return null;
      return p.pathname.replace(/\.html$/, '').replace(/\/index$/, '/').replace(/(.)\/$/, '$1');
    } catch (e) {
      return null;
    }
  }

  function isWork(path) {
    return path === '/' || path.indexOf('/work/') === 0 || path.indexOf('/projects/') === 0;
  }

  function shouldCut(from, to) {
    var a = normalise(from);
    var b = normalise(to);
    return !!(a && b && a !== b && isWork(a) && isWork(b));
  }

  window.addEventListener('pagereveal', function (event) {
    var vt = event.viewTransition;
    if (!vt) return;

    var from = null;
    var to = location.href;
    var nav = /** @type {any} */ (window).navigation;
    if (nav && nav.activation) {
      if (nav.activation.from) from = nav.activation.from.url;
      if (nav.activation.entry) to = nav.activation.entry.url;
    } else if (document.referrer) {
      from = document.referrer;
    }

    if (!from || !shouldCut(from, to) || matchMedia('(prefers-reduced-motion: reduce)').matches) {
      vt.skipTransition();
      return;
    }

    root.classList.add('vt-cut', 'vt-settle');
    vt.finished.finally(function () {
      root.classList.remove('vt-cut');
    });
    clearTimeout(settleTimer);
    settleTimer = setTimeout(function () {
      root.classList.remove('vt-settle');
    }, 900);
  });

  // Returning from the back/forward cache must never show a stale state.
  window.addEventListener('pageshow', function (event) {
    if (event.persisted) root.classList.remove('vt-cut', 'vt-settle');
  });
})();
