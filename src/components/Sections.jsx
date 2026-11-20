import { useEffect, useRef, useState } from 'react';
import Picture from './Picture.jsx';
import CollectionDialog from './CollectionDialog.jsx';
import { collections, contact, hero, matiere, media, navigation } from '../content/site.js';
import { scrollToHash, useReducedMotion, useReveal } from '../hooks/index.js';

/* ------------------------------------------------------------------ */
/* Collections                                                         */
/* ------------------------------------------------------------------ */
function CollectionCard({ collection, index, onOpen }) {
  const [ref, visible] = useReveal({ threshold: 0.15 });
  const { image, hoverImage } = collection;
  return (
    <article
      ref={ref}
      className={`card card--${index === 0 ? 'lead' : 'offset'} reveal ${visible ? 'is-visible' : ''}`}
      style={{ '--delay': `${index * 240}ms` }}
    >
      <button type="button" className="card__media" onClick={(e) => onOpen(collection.slug, e.currentTarget)} tabIndex={-1} aria-hidden="true">
        <span className="card__frame" style={{ aspectRatio: `${image.width} / ${image.height}` }}>
          <Picture {...image} sizes="(max-width: 760px) 100vw, 45vw" imgClassName="card__img" />
          {hoverImage && (
            <Picture {...hoverImage} alt="" sizes="(max-width: 760px) 100vw, 45vw" imgClassName="card__img card__img--hover" />
          )}
        </span>
      </button>
      <h3 className="card__title">{collection.title}</h3>
      <button
        type="button"
        className="link"
        onClick={(e) => onOpen(collection.slug, e.currentTarget)}
        aria-label={`${collection.linkLabel} la collection ${collection.title}`}
        aria-haspopup="dialog"
      >
        {collection.linkLabel}
      </button>
    </article>
  );
}

export function CollectionsSection() {
  const reduced = useReducedMotion();
  const [openSlug, setOpenSlug] = useState(null);
  return (
    <section className="collections" id="collections" aria-labelledby="collections-titre" data-intro-inert>
      <div className="container">
        <h2 id="collections-titre" className={reduced ? 'collections__title' : 'sr-only'}>
          {hero.sectionTitle}
        </h2>
        <div className="collections__grid">
          {collections.map((c, i) => (
            <CollectionCard key={c.slug} collection={c} index={i} onOpen={setOpenSlug} />
          ))}
        </div>
      </div>
      <CollectionDialog slug={openSlug} onClose={() => setOpenSlug(null)} onSwitch={setOpenSlug} />
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* La Maison — section Matière                                          */
/* ------------------------------------------------------------------ */
export function MatiereSection() {
  const [imgRef, imgVisible] = useReveal({ threshold: 0.1 });
  const linesRef = useRef(null);
  const [shown, setShown] = useState(0);

  // Les mots apparaissent un à un à mesure que le bloc monte dans l'écran.
  useEffect(() => {
    const el = linesRef.current;
    if (!el) return undefined;
    let raf = 0;
    const update = () => {
      raf = 0;
      // Chaque mot apparaît quand il atteint 94 % de la hauteur de l'écran.
      const limit = window.innerHeight * 0.94;
      const n = [...el.children].filter((line) => line.getBoundingClientRect().top < limit).length;
      setShown((prev) => (n > prev ? n : prev));
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
    };
  }, []);

  return (
    <section className="matiere" id="matiere" aria-labelledby="matiere-titre" data-intro-inert>
      <div className="matiere__inner container">
        <div ref={imgRef} className={`matiere__media reveal reveal--soft ${imgVisible ? 'is-visible' : ''}`}>
          <Picture {...media.fabric} sizes="(max-width: 900px) 100vw, 58vw" imgClassName="matiere__img" />
        </div>
        <div className="matiere__text">
          <h2 id="matiere-titre" ref={linesRef} className="matiere__lines" aria-label={matiere.lines.join(' ')}>
            {matiere.lines.map((line, i) => (
              <span
                key={line}
                aria-hidden="true"
                className={`matiere__line ${i < shown ? 'is-visible' : ''}`}
                style={{ transitionDelay: `${i * 0.18}s` }}
              >
                {line}
              </span>
            ))}
          </h2>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Footer — avec l'accès au contact                                    */
/* ------------------------------------------------------------------ */
export function Footer() {
  const rows = [
    contact.email && { label: 'E-mail', value: contact.email, href: `mailto:${contact.email}` },
    contact.telephone && { label: 'Téléphone', value: contact.telephone, href: `tel:${contact.telephone.replace(/\s/g, '')}` },
    contact.adresse && { label: 'Adresse', value: contact.adresse },
    contact.instagram && { label: 'Instagram', value: contact.instagram.handle, href: contact.instagram.url, external: true },
  ].filter(Boolean);

  const go = (e, href) => {
    e.preventDefault();
    scrollToHash(href);
  };

  return (
    <footer className="footer" id="contact" data-intro-inert>
      <div className="footer__inner container">
        <a className="footer__brand" href="#accueil" onClick={(e) => go(e, '#accueil')} aria-label="Création Privée — haut de page">
          <img src={media.logo} width="800" height="456" alt="Création Privée" loading="lazy" decoding="async" />
        </a>

        <nav className="footer__col" aria-label="Navigation du pied de page">
          <h2 className="footer__label">Navigation</h2>
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

        <div className="footer__col">
          <h2 className="footer__label">Contact</h2>
          {rows.length > 0 ? (
            <ul>
              {rows.map((r) => (
                <li key={r.label}>
                  {r.href ? (
                    <a href={r.href} {...(r.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
                      {r.value}
                    </a>
                  ) : (
                    r.value
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="footer__note">Les coordonnées de la maison seront communiquées prochainement.</p>
          )}
        </div>
      </div>
      <div className="footer__base container">
        <span>© {new Date().getFullYear()} Création Privée</span>
      </div>
    </footer>
  );
}
