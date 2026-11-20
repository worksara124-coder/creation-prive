import { useEffect, useRef, useState, useSyncExternalStore } from 'react';

/* Préférence de mouvement réduit ------------------------------------ */
const RM = '(prefers-reduced-motion: reduce)';
const subscribeRM = (cb) => {
  const mq = window.matchMedia(RM);
  mq.addEventListener('change', cb);
  return () => mq.removeEventListener('change', cb);
};
export const useReducedMotion = () =>
  useSyncExternalStore(subscribeRM, () => window.matchMedia(RM).matches, () => false);

/* Apparition au scroll (une seule fois) ----------------------------- */
export function useReveal({ threshold = 0.2, rootMargin = '0px 0px -8% 0px' } = {}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    if (!('IntersectionObserver' in window)) {
      setVisible(true);
      return undefined;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold, rootMargin }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold, rootMargin]);
  return [ref, visible];
}

/* Fenêtre modale : Échap, focus piégé, focus rendu, défilement bloqué */
let openModals = 0;
export function useModal(open, onClose) {
  const ref = useRef(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  useEffect(() => {
    if (!open) return undefined;
    const panel = ref.current;
    const previous = document.activeElement;
    const root = document.documentElement;
    openModals += 1;
    root.classList.add('is-modal-open');

    const focusables = () =>
      [...panel.querySelectorAll('a[href], button:not([disabled]), input, select, [tabindex]:not([tabindex="-1"])')].filter(
        (el) => el.offsetParent !== null
      );
    const raf = requestAnimationFrame(() => (panel.querySelector('[data-autofocus]') || focusables()[0])?.focus());

    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        closeRef.current();
      } else if (e.key === 'Tab') {
        const els = focusables();
        if (!els.length) return;
        const first = els[0];
        const last = els[els.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    panel.addEventListener('keydown', onKey);
    return () => {
      cancelAnimationFrame(raf);
      panel.removeEventListener('keydown', onKey);
      openModals -= 1;
      if (openModals <= 0) root.classList.remove('is-modal-open');
      if (previous && typeof previous.focus === 'function' && document.contains(previous)) previous.focus();
    };
  }, [open]);

  return ref;
}

/* Fenêtre montée le temps de son animation de sortie ---------------- */
export function usePresence(open, ms = 450) {
  const [mounted, setMounted] = useState(open);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    if (open) {
      setMounted(true);
      const raf = requestAnimationFrame(() => requestAnimationFrame(() => setShown(true)));
      return () => cancelAnimationFrame(raf);
    }
    setShown(false);
    const t = window.setTimeout(() => setMounted(false), ms);
    return () => window.clearTimeout(t);
  }, [open, ms]);
  return { mounted, shown };
}

/* Session : l'intro ne se joue qu'une fois par session -------------- */
const KEY = 'cp:intro-vue';
const readSeen = () => {
  try {
    return window.sessionStorage.getItem(KEY) === '1';
  } catch {
    return false;
  }
};
const markSeen = () => {
  try {
    window.sessionStorage.setItem(KEY, '1');
  } catch {
    /* stockage indisponible : sans conséquence */
  }
};
// Décidé au chargement : première ouverture, arrivée en haut de l'accueil (sans ancre).
let introEligible = typeof window !== 'undefined' && !readSeen() && !window.location.hash.replace('#', '');
export const isIntroEligible = () => introEligible;
export const clearIntroEligibility = () => {
  introEligible = false;
  markSeen();
};

/* Défilement vers une ancre (respecte le mouvement réduit) ---------- */
export function scrollToHash(hash) {
  const el = hash && document.getElementById(hash.replace('#', ''));
  if (!el) return;
  const reduced = window.matchMedia(RM).matches;
  const header = document.querySelector('.header');
  const offset = el.dataset.anchorOffset === 'none' ? 0 : header ? header.offsetHeight : 0;
  const y = el.getBoundingClientRect().top + window.scrollY - offset;
  window.scrollTo({ top: y, behavior: reduced ? 'auto' : 'smooth' });
  if (window.location.hash !== hash) window.history.replaceState(null, '', hash);
}
