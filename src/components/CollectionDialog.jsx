import { useEffect, useRef, useState } from 'react';
import Picture from './Picture.jsx';
import { collections, produits } from '../content/site.js';
import { useModal, usePresence } from '../hooks/index.js';
import { formatPrix, useCart } from '../cart.jsx';

function Piece({ produit }) {
  const { add, setOpen } = useCart();
  const [taille, setTaille] = useState(produit.tailles ? null : undefined);
  const [added, setAdded] = useState(false);
  const timer = useRef(0);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const needsSize = Array.isArray(produit.tailles) && !taille;

  return (
    <li className="piece">
      <img className="piece__thumb" src={produit.image.thumb} width="160" height="200" alt="" loading="lazy" decoding="async" />
      <div className="piece__head">
        <h3 className="piece__name">{produit.nom}</h3>
        <p className="piece__price">{formatPrix(produit.prix)}</p>
      </div>

      {Array.isArray(produit.tailles) && (
        <fieldset className="sizes">
          <legend className="sr-only">Taille — {produit.nom}</legend>
          {produit.tailles.map((t) => (
            <label key={t} className={`size ${taille === t ? 'is-active' : ''}`}>
              <input type="radio" name={`taille-${produit.id}`} value={t} checked={taille === t} onChange={() => setTaille(t)} />
              <span>{t}</span>
            </label>
          ))}
        </fieldset>
      )}

      <div className="piece__actions">
        <button
          type="button"
          className="btn btn--small"
          disabled={needsSize}
          onClick={() => {
            add(produit.id, taille);
            setAdded(true);
            window.clearTimeout(timer.current);
            timer.current = window.setTimeout(() => setAdded(false), 2400);
          }}
        >
          {needsSize ? 'Choisir une taille' : 'Ajouter au panier'}
        </button>
        <span className={`piece__added ${added ? 'is-visible' : ''}`} role="status">
          {added && (
            <>
              Ajouté.{' '}
              <button type="button" className="link link--small" onClick={() => setOpen(true)}>
                Voir le panier
              </button>
            </>
          )}
        </span>
      </div>
    </li>
  );
}

/** Présentation d'une collection, en fenêtre plein écran (accueil uniquement). */
export default function CollectionDialog({ slug, onClose, onSwitch }) {
  const open = slug != null;
  const last = useRef(slug);
  if (slug) last.current = slug;
  const { mounted, shown } = usePresence(open, 550);
  const ref = useModal(open && mounted, onClose);
  const { open: cartOpen } = useCart();

  // Le panier s'ouvre par-dessus : on referme la collection pour garder un seul niveau.
  useEffect(() => {
    if (cartOpen && open) onClose();
  }, [cartOpen, open, onClose]);

  if (!mounted) return null;
  const index = collections.findIndex((c) => c.slug === last.current);
  const c = collections[index];
  if (!c) return null;
  const pieces = produits.filter((p) => p.collection === c.slug);
  const next = collections[(index + 1) % collections.length];

  return (
    <div className={`overlay ${shown ? 'is-open' : ''}`}>
      <div className="overlay__backdrop" onClick={onClose} aria-hidden="true" />
      <div ref={ref} className="sheet" role="dialog" aria-modal="true" aria-labelledby="sheet-titre">
        <div className="sheet__media">
          <span className="sheet__frame" key={c.slug}>
            <Picture {...c.image} sizes="(max-width: 900px) 100vw, 50vw" eager imgClassName="cover" />
          </span>
        </div>
        <div className="sheet__body" key={`b-${c.slug}`}>
          <div className="sheet__bar">
            <p className="eyebrow">Collection</p>
            <button type="button" className="sheet__close" onClick={onClose} data-autofocus>
              Fermer
            </button>
          </div>
          <h2 id="sheet-titre" className="sheet__title">
            {c.title}
          </h2>
          {c.intro && <p className="lede">{c.intro}</p>}

          <ul className="pieces">
            {pieces.map((p) => (
              <Piece key={p.id} produit={p} />
            ))}
          </ul>

          {next && next.slug !== c.slug && (
            <button type="button" className="sheet__next" onClick={() => onSwitch(next.slug)}>
              <span className="eyebrow">Collection suivante</span>
              <span className="sheet__next-title">{next.title}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
