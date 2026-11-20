import { useEffect } from 'react';
import { collections } from '../content/site.js';
import { useModal, usePresence } from '../hooks/index.js';
import { formatPrix, useCart } from '../cart.jsx';

const collectionTitle = Object.fromEntries(collections.map((c) => [c.slug, c.title]));

/** Tiroir des favoris. */
export function FavDrawer() {
  const { favProduits, toggleFav, add, favOpen, setFavOpen, setOpen } = useCart();
  const { mounted, shown } = usePresence(favOpen, 500);
  const ref = useModal(favOpen && mounted, () => setFavOpen(false));
  if (!mounted) return null;

  return (
    <div className={`overlay overlay--drawer ${shown ? 'is-open' : ''}`}>
      <div className="overlay__backdrop" onClick={() => setFavOpen(false)} aria-hidden="true" />
      <aside ref={ref} className="drawer" role="dialog" aria-modal="true" aria-labelledby="favoris-titre">
        <div className="drawer__bar">
          <h2 id="favoris-titre" className="drawer__title">
            Favoris <span className="drawer__count">({favProduits.length})</span>
          </h2>
          <button type="button" className="sheet__close" onClick={() => setFavOpen(false)} data-autofocus>
            Fermer
          </button>
        </div>
        {favProduits.length === 0 ? (
          <div className="drawer__empty">
            <p>Aucun favori pour le moment. Touchez le cœur d’une pièce pour la retrouver ici.</p>
          </div>
        ) : (
          <ul className="drawer__lines">
            {favProduits.map((p) => (
              <li key={p.id} className="line">
                <span className="line__thumb">
                  <img src={p.image.thumb} width="160" height="200" alt="" loading="lazy" decoding="async" className="cover" />
                </span>
                <div className="line__info">
                  <p className="line__name">{p.nom}</p>
                  <p className="line__meta">{collectionTitle[p.collection]}</p>
                  <p className="line__price">{formatPrix(p.prix)}</p>
                  <div className="line__row">
                    <button
                      type="button"
                      className="btn btn--small"
                      disabled={Array.isArray(p.tailles)}
                      onClick={() => {
                        add(p.id);
                        setOpen(true);
                      }}
                    >
                      Ajouter au panier
                    </button>
                    <button type="button" className="link link--small" onClick={() => toggleFav(p.id)}>
                      Retirer
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </aside>
    </div>
  );
}

/** Confirmation discrète après un ajout rapide au panier. */
export function CartToast() {
  const { toast, clearToast, setOpen } = useCart();
  useEffect(() => {
    if (!toast) return undefined;
    const t = window.setTimeout(clearToast, 3200);
    return () => window.clearTimeout(t);
  }, [toast, clearToast]);
  return (
    <div className="toast-region" role="status" aria-live="polite">
      {toast && (
        <div className="toast" key={toast.n}>
          <span>{toast.nom} ajouté au panier.</span>
          <button
            type="button"
            className="link link--small"
            onClick={() => {
              clearToast();
              setOpen(true);
            }}
          >
            Voir le panier
          </button>
        </div>
      )}
    </div>
  );
}
