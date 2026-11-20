import { useCallback, useEffect, useRef, useState } from 'react';
import Picture from './Picture.jsx';
import { hero, media } from '../content/site.js';
import { clearIntroEligibility, isIntroEligible, scrollToHash, useReducedMotion } from '../hooks/index.js';

const smooth = (t) => t * t * (3 - 2 * t);
const FADE_END = 1300; // fin naturelle : le tissu laisse place au hero
const FADE_SKIP = 600; // « Passer l'intro »

/**
 * Intro vidéo (plein écran, une fois par session) → hero → animation au scroll.
 * La vidéo se termine sur le tissu plein cadre ; elle s'efface en fondu
 * sur le visuel du hero, déjà chargé dessous.
 */
export default function HeroStage() {
  const reduced = useReducedMotion();
  const [phase, setPhase] = useState(() => (!reduced && isIntroEligible() ? 'intro' : 'hero'));
  const [video, setVideo] = useState(phase === 'intro' ? 'on' : 'off'); // on | fading | off
  const [fadeMs, setFadeMs] = useState(FADE_END);
  const [ready, setReady] = useState(phase === 'hero');
  const stageRef = useRef(null);
  const videoRef = useRef(null);
  const timers = useRef([]);

  const [variant] = useState(() => {
    if (window.matchMedia('(max-aspect-ratio: 1/2)').matches) return 'portrait';
    if (window.matchMedia('(max-width: 900px)').matches) return 'mobile';
    return 'desktop';
  });
  const poster = variant === 'portrait' ? media.intro.posterPortrait : media.intro.poster;

  const fadeOut = useCallback((ms) => {
    setFadeMs(ms);
    setVideo('fading');
    setPhase('hero');
    timers.current.push(
      window.setTimeout(() => {
        videoRef.current?.pause();
        setVideo('off');
      }, ms + 50)
    );
  }, []);

  const onEnded = useCallback(() => fadeOut(FADE_END), [fadeOut]);
  const skip = useCallback(() => fadeOut(FADE_SKIP), [fadeOut]);
  const fail = useCallback(() => {
    videoRef.current?.pause();
    setVideo('off');
    setPhase('hero');
  }, []);

  /* Lancement de l'intro */
  useEffect(() => {
    if (phase !== 'intro') return undefined;
    clearIntroEligibility();
    const v = videoRef.current;
    if (!v) {
      fail();
      return undefined;
    }
    v.muted = true;
    const p = v.play();
    if (p && typeof p.catch === 'function') p.catch(fail);
    const watchdog = window.setTimeout(() => {
      if (v.currentTime < 0.05) fail();
    }, 4000);
    return () => window.clearTimeout(watchdog);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (reduced && phase === 'intro') fail();
  }, [reduced, phase, fail]);

  /* Pendant l'intro : défilement bloqué, reste de la page inerte */
  useEffect(() => {
    const root = document.documentElement;
    const others = () => document.querySelectorAll('[data-intro-inert]');
    if (phase === 'intro') {
      root.classList.add('is-intro');
      others().forEach((el) => el.setAttribute('inert', ''));
      window.scrollTo(0, 0);
      return () => {
        root.classList.remove('is-intro');
        others().forEach((el) => el.removeAttribute('inert'));
      };
    }
    root.classList.remove('is-intro');
    others().forEach((el) => el.removeAttribute('inert'));
    const raf = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(raf);
  }, [phase]);

  /* Animation signature : suit le scroll, sans jamais le bloquer */
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || reduced || phase !== 'hero') return undefined;
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = stage.getBoundingClientRect();
      const total = r.height - window.innerHeight;
      const raw = total > 0 ? Math.min(Math.max(-r.top / total, 0), 1) : 0;
      stage.style.setProperty('--p', smooth(raw).toFixed(4));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
      stage.style.removeProperty('--p');
    };
  }, [phase, reduced]);

  useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), []);

  const isIntro = phase === 'intro';

  return (
    <section
      ref={stageRef}
      id="accueil"
      className={`stage ${reduced ? 'stage--static' : ''} ${ready ? 'is-ready' : ''}`}
      aria-label="Accueil"
    >
      <div className="stage__sticky">
        <div className="stage__frame">
          <div className="stage__media">
            <Picture {...media.hero} sizes="100vw" eager className="stage__picture" imgClassName="stage__img" />
          </div>
        </div>

        {!reduced && (
          <h2 className="stage__title" aria-hidden="true">
            {hero.sectionTitle}
          </h2>
        )}

        <div className="stage__copy" hidden={isIntro}>
          <div className="stage__copy-inner">
            <h1 className="stage__heading">
              {hero.title.map((l) => (
                <span key={l}>{l}</span>
              ))}
            </h1>
            <a
              className="btn"
              href={hero.cta.href}
              onClick={(e) => {
                e.preventDefault();
                scrollToHash(hero.cta.href);
              }}
            >
              {hero.cta.label}
            </a>
          </div>
        </div>

        {video !== 'off' && (
          <div
            className={`intro ${video === 'fading' ? 'is-fading' : ''}`}
            style={{ '--fade': `${fadeMs}ms` }}
          >
            <video
              ref={videoRef}
              className="intro__video"
              src={media.intro[variant]}
              poster={poster}
              muted
              playsInline
              autoPlay
              preload="auto"
              disablePictureInPicture
              disableRemotePlayback
              onEnded={onEnded}
              onError={fail}
              aria-hidden="true"
              tabIndex={-1}
            />
            {isIntro && (
              <button type="button" className="skip-intro" onClick={skip}>
                Passer l’intro
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
