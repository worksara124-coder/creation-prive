import { useEffect, useRef, useState } from 'react';
import { media, navigation } from '../content/site.js';
import { scrollToHash, useModal, usePresence } from '../hooks/index.js';
import { useCart } from '../cart.jsx';
import { BagIcon, HeartIcon } from './Icons.jsx';

function useBump(value) {
  const [bump, setBump] = useState(false);
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return undefined;
    }
    setBump(true);
    const t = window.setTimeout(() => setBump(false), 600);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);
  return bump;
}

function HeaderIcons() {
  const { count, setOpen, favs, setFavOpen } = useCart();
  const bumpCart = useBump(count);
  const bumpFav = useBump(favs.length);
  return (
    <>
      <button type="button" className="icon-count" onClick={() => setFavOpen(true)} aria-label={`Favoris, ${favs.length}`}>
        <HeartIcon filled={favs.length > 0} />
        <span className={bumpFav ? 'is-bump' : ''} aria-hidden="true">
          ({favs.length})
        </span>
      </button>
      <button type="button" className="icon-count" onClick={() => setOpen(true)} aria-label={`Panier, ${count} article${count > 1 ? 's' : ''}`}>
        <BagIcon />
        <span className={bumpCart ? 'is-bump' : ''} aria-hidden="true">
          ({count})
        </span>
      </button>
    </>
  );
}

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [solid, setSolid] = useState(false);
  const menu = usePresence(menuOpen, 400);
  const panelRef = useModal(menuOpen && menu.mounted, () => setMenuOpen(false));

  // Fond beige une fois la scène d'accueil dépassée.
  useEffect(() => {
    let raf = 0;
    const check = () => {
      raf = 0;
      const stage = document.getElementById('accueil');
      setSolid(stage ? stage.getBoundingClientRect().bottom < 90 : window.scrollY > 40);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(check);
    };
    check();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const onResize = () => window.innerWidth > 900 && setMenuOpen(false);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [menuOpen]);

  const go = (e, href) => {
    e.preventDefault();
    setMenuOpen(false);
    // Laisse le menu se refermer avant de défiler.
    window.setTimeout(() => scrollToHash(href), menuOpen ? 60 : 0);
  };

  return (
    <header className={`header ${solid ? 'is-solid' : ''}`} data-intro-inert>
      <div className="header__inner">
        <a className="header__logo" href="#accueil" onClick={(e) => go(e, '#accueil')} aria-label="Création Privée — haut de page">
          <img src={media.monogram} width="200" height="240" alt="" />
          <span>Création Privée</span>
        </a>

        <nav className="header__nav" aria-label="Navigation principale">
          <ul>
            {navigation.map((item) => (
              <li key={item.href}>
                <a href={item.href} onClick={(e) => go(e, item.href)}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="header__actions">
          <HeaderIcons />
          <button
            type="button"
            className="header__toggle"
            aria-expanded={menuOpen}
            aria-controls="menu-mobile"
            onClick={() => setMenuOpen(true)}
          >
            Menu
          </button>
        </div>
      </div>

      {menu.mounted && (
        <div
          id="menu-mobile"
          ref={panelRef}
          className={`menu ${menu.shown ? 'is-open' : ''}`}
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
        >
          <div className="menu__top">
            <span className="header__logo" aria-hidden="true">
              <img src={media.monogram} width="200" height="240" alt="" />
              <span>Création Privée</span>
            </span>
            <button type="button" className="menu__close" onClick={() => setMenuOpen(false)} data-autofocus>
              Fermer
            </button>
          </div>
          <nav aria-label="Navigation mobile">
            <ul className="menu__list">
              {navigation.map((item, i) => (
                <li key={item.href} style={{ '--i': i }}>
                  <a href={item.href} onClick={(e) => go(e, item.href)}>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
}
