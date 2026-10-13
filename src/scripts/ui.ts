/* Progressive enhancements: mobile menu, click-to-load video, muted preview loops. */

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

/* ---------------- Mobile menu (native <dialog>: focus is trapped, Esc closes) ---------------- */

const menu = document.getElementById('menu') as HTMLDialogElement | null;
const openBtn = document.querySelector<HTMLButtonElement>('[data-menu-open]');
const closeBtn = document.querySelector<HTMLButtonElement>('[data-menu-close]');

if (menu && openBtn && typeof menu.showModal === 'function') {
  openBtn.addEventListener('click', () => {
    menu.showModal();
    openBtn.setAttribute('aria-expanded', 'true');
    const current = menu.querySelector<HTMLAnchorElement>('.nav a[aria-current]');
    (current ?? closeBtn)?.focus();
  });
  closeBtn?.addEventListener('click', () => menu.close());
  menu.addEventListener('close', () => {
    openBtn.setAttribute('aria-expanded', 'false');
    openBtn.focus();
  });
  // Close if the viewport grows into the desktop layout while open.
  window.matchMedia('(min-width: 1024px)').addEventListener('change', (e) => {
    if (e.matches && menu.open) menu.close();
  });
  // Leaving via the back/forward cache must not restore an open menu.
  window.addEventListener('pagehide', () => {
    if (menu.open) menu.close();
  });
} else if (openBtn) {
  // No <dialog> support: the footer navigation remains available.
  openBtn.addEventListener('click', () => document.querySelector('.footer nav')?.scrollIntoView());
}

/* ---------------- Click-to-load video ---------------- */

document.querySelectorAll<HTMLElement>('[data-video-embed]').forEach((box) => {
  const play = box.querySelector<HTMLAnchorElement>('[data-video-play]');
  play?.addEventListener('click', (event) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
    event.preventDefault();
    const iframe = document.createElement('iframe');
    iframe.src = box.dataset.videoEmbed!;
    iframe.title = box.dataset.videoTitle ?? 'Video';
    iframe.allow = 'autoplay; fullscreen; picture-in-picture; encrypted-media';
    iframe.allowFullscreen = true;
    iframe.referrerPolicy = 'strict-origin-when-cross-origin';
    box.replaceChildren(iframe);
    iframe.focus();
  });
});

/* ---------------- Muted preview loops ----------------
 * data-loop="auto": plays muted while in view, with a visible pause button.
 * data-loop="hover": inside a link; plays only while hovered or focused.
 * Nothing plays when the visitor prefers reduced motion.
 */

const loops = document.querySelectorAll<HTMLVideoElement>('video[data-loop]');
if (loops.length && !reduceMotion.matches) {
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        const v = e.target as HTMLVideoElement;
        if (v.dataset.paused === 'user') continue;
        if (e.isIntersecting) v.play().catch(() => {});
        else v.pause();
      }
    },
    { threshold: 0.25 },
  );
  loops.forEach((v) => {
    v.hidden = false;
    v.preload = 'metadata';
    if (v.dataset.loop === 'hover') {
      const trigger = v.closest('a') ?? v.parentElement!;
      const start = () => v.play().catch(() => {});
      const stop = () => v.pause();
      trigger.addEventListener('pointerenter', start);
      trigger.addEventListener('pointerleave', stop);
      trigger.addEventListener('focusin', start);
      trigger.addEventListener('focusout', stop);
      return;
    }
    io.observe(v);
    const toggle = v.parentElement?.querySelector<HTMLButtonElement>('[data-loop-toggle]');
    if (!toggle) return;
    toggle.hidden = false;
    toggle.addEventListener('click', () => {
      if (v.paused) {
        v.dataset.paused = '';
        v.play().catch(() => {});
        toggle.textContent = 'Pause motion';
      } else {
        v.dataset.paused = 'user';
        v.pause();
        toggle.textContent = 'Play motion';
      }
    });
  });
}
