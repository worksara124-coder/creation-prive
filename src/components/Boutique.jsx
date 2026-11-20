import { useEffect, useRef, useState } from 'react';
import Picture from './Picture.jsx';
import { BagIcon, HeartIcon } from './Icons.jsx';
import { boutique, categories, collections, maison, produits } from '../content/site.js';
import { scrollToHash, useModal, usePresence, useReveal } from '../hooks/index.js';
import { formatPrix, useCart } from '../cart.jsx';

/* ------------------------------------------------------------------ */
/* La Maison — image de l'atelier + texte                              */
/* ------------------------------------------------------------------ */
export function MaisonSection() {
  const [ref, visible] = useReveal({ threshold: 0.2 });
  return (
    <section ref={ref} id="maison" className={`maison ${visible ? 'is-visible' : ''}`} aria-labelledby="maison-titre" data-intro-inert>
      <div className="maison__inner container">
        <div className="maison__media">
          <span className="maison__frame">
            <Picture {...maison.image} sizes="(max-width: 900px) 100vw, 40vw" imgClassName="cover" />
          </span>
        </div>
        <div className="maison__text">
          <p className="eyebrow eyebrow--wide maison__step">{maison.eyebrow}</p>
          <h2 id="maison-titre" className="maison__title maison__step">
            {maison.title.map((l) => (
              <span key={l}>{l}</span>
            ))}
          </h2>
          <p className="maison__lede maison__step">{maison.text}</p>
          <a
            className="link maison__step"
            href={maison.link.href}
            onClick={(e) => {
              e.preventDefault();
              scrollToHash(maison.link.href);
            }}
          >
            {maison.link.label}
          </a>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Carte produit                                                        */
/* ------------------------------------------------------------------ */
function ProductCard({ produit, index, onOpen }) {
  const [ref, visible] = useReveal({ threshold: 0.12 });
  const { add, isFav, toggleFav } = useCart();
  const fav = isFav(produit.id);
  return (
    <li ref={ref} className={`product reveal ${visible ? 'is-visible' : ''}`} style={{ '--delay': `${(index % 4) * 110}ms` }}>
      <div className="product__media">
        <button type="button" className="product__open" onClick={(e) => onOpen(produit.id, e.currentTarget)} tabIndex={-1} aria-hidden="true">
          <Picture {...produit.image} sizes="(max-width: 600px) 50vw, (max-width: 1100px) 34vw, 24vw" imgClassName="product__img" />
        </button>
        <button
          type="button"
          className={`icon-btn product__fav ${fav ? 'is-active' : ''}`}
          aria-pressed={fav}
          aria-label={fav ? `Retirer ${produit.nom} des favoris` : `Ajouter ${produit.nom} aux favoris`}
          onClick={() => toggleFav(produit.id)}
        >
          <HeartIcon filled={fav} />
        </button>
      </div>
      <div className="product__row">
        <h3 className="product__name">{produit.nom}</h3>
        <button
          type="button"
          className="icon-btn product__bag"
          aria-label={`Ajouter ${produit.nom} au panier`}
          onClick={() => add(produit.id, undefined, { notify: true })}
          disabled={Array.isArray(produit.tailles)}
          title={Array.isArray(produit.tailles) ? 'Choisissez une taille' : undefined}
        >
          <BagIcon />
        </button>
      </div>
      <p className="product__price">{formatPrix(produit.prix)}</p>
      <button type="button" className="link" onClick={(e) => onOpen(produit.id, e.currentTarget)} aria-haspopup="dialog" aria-label={`Découvrir ${produit.nom}`}>
        Découvrir
      </button>
    </li>
  );
}

/* ------------------------------------------------------------------ */
/* Fiche produit (fenêtre)                                              */
/* ------------------------------------------------------------------ */
function ProductDialog({ id, onClose }) {
  const open = id != null;
  const last = useRef(id);
  if (id) last.current = id;
  const { mounted, shown } = usePresence(open, 550);
  const ref = useModal(open && mounted, onClose);
  const { add, isFav, toggleFav, setOpen, open: cartOpen } = useCart();
  const [taille, setTaille] = useState(null);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    setTaille(null);
    setAdded(false);
  }, [id]);
  useEffect(() => {
    if (cartOpen && open) onClose();
  }, [cartOpen, open, onClose]);

  if (!mounted) return null;
  const p = produits.find((x) => x.id === last.current);
  if (!p) return null;
  const col = collections.find((c) => c.slug === p.collection);
  const needsSize = Array.isArray(p.tailles) && !taille;
  const fav = isFav(p.id);

  return (
    <div className={`overlay ${shown ? 'is-open' : ''}`}>
      <div className="overlay__backdrop" onClick={onClose} aria-hidden="true" />
      <div ref={ref} className="sheet sheet--product" role="dialog" aria-modal="true" aria-labelledby="produit-titre">
        <div className="sheet__media sheet__media--product">
          <span className="sheet__frame">
            <Picture {...p.image} sizes="(max-width: 900px) 100vw, 50vw" eager imgClassName="cover" />
          </span>
        </div>
        <div className="sheet__body">
          <div className="sheet__bar">
            <p className="eyebrow">{col ? col.title : 'La collection'}</p>
            <button type="button" className="sheet__close" onClick={onClose} data-autofocus>
              Fermer
            </button>
          </div>
          <div className="product-detail">
            <h2 id="produit-titre" className="sheet__title">
              {p.nom}
            </h2>
            <p className="product-detail__price">
              {formatPrix(p.prix)}
              {typeof p.prix === 'number' && <span className="product-detail__note"> · Prix indicatif</span>}
            </p>

            {Array.isArray(p.tailles) && (
              <fieldset className="sizes">
                <legend className="eyebrow">Taille</legend>
                {p.tailles.map((t) => (
                  <label key={t} className={`size ${taille === t ? 'is-active' : ''}`}>
                    <input type="radio" name="taille" value={t} checked={taille === t} onChange={() => setTaille(t)} />
                    <span>{t}</span>
                  </label>
                ))}
              </fieldset>
            )}

            <div className="product-detail__actions">
              <button
                type="button"
                className="btn btn--solid"
                disabled={needsSize}
                onClick={() => {
                  add(p.id, taille);
                  setAdded(true);
                }}
              >
                {needsSize ? 'Choisir une taille' : 'Ajouter au panier'}
              </button>
              <button
                type="button"
                className={`btn btn--icon ${fav ? 'is-active' : ''}`}
                aria-pressed={fav}
                aria-label={fav ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                onClick={() => toggleFav(p.id)}
              >
                <HeartIcon filled={fav} />
              </button>
            </div>
            <p className={`piece__added ${added ? 'is-visible' : ''}`} role="status">
              {added && (
                <>
                  Ajouté au panier.{' '}
                  <button type="button" className="link link--small" onClick={() => setOpen(true)}>
                    Voir le panier
                  </button>
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* La collection — filtres + grille                                     */
/* ------------------------------------------------------------------ */
export function BoutiqueSection() {
  const [filter, setFilter] = useState('tout');
  const [openId, setOpenId] = useState(null);
  const [headRef, headVisible] = useReveal({ threshold: 0.3 });
  const list = filter === 'tout' ? produits : produits.filter((p) => p.categorie === filter);
  const counts = Object.fromEntries(categories.map((c) => [c.id, c.id === 'tout' ? produits.length : produits.filter((p) => p.categorie === c.id).length]));

  return (
    <section id="boutique" className="boutique" aria-labelledby="boutique-titre" data-intro-inert>
      <div className="container">
        <header ref={headRef} className={`boutique__head reveal reveal--soft ${headVisible ? 'is-visible' : ''}`}>
          <h2 id="boutique-titre" className="boutique__title">
            {boutique.title}
          </h2>
          <p className="boutique__subtitle">{boutique.subtitle}</p>
          <div className="filters" role="group" aria-label="Filtrer par catégorie">
            {categories
              .filter((c) => counts[c.id] > 0)
              .map((c) => (
                <button
                  key={c.id}
                  type="button"
                  className={`filter ${filter === c.id ? 'is-active' : ''}`}
                  aria-pressed={filter === c.id}
                  onClick={() => setFilter(c.id)}
                >
                  {c.label}
                </button>
              ))}
          </div>
        </header>

        <ul className="products" key={filter} aria-live="polite">
          {list.map((p, i) => (
            <ProductCard key={p.id} produit={p} index={i} onOpen={setOpenId} />
          ))}
        </ul>
        <p className="boutique__note">{boutique.note}</p>
      </div>
      <ProductDialog id={openId} onClose={() => setOpenId(null)} />
    </section>
  );
}
