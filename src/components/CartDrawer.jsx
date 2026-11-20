import { collections } from '../content/site.js';
import { scrollToHash, useModal, usePresence } from '../hooks/index.js';
import { formatPrix, useCart } from '../cart.jsx';

const collectionTitle = Object.fromEntries(collections.map((c) => [c.slug, c.title]));

export default function CartDrawer() {
  const { lines, count, subtotal, setQty, remove, open, setOpen } = useCart();
  const { mounted, shown } = usePresence(open, 500);
  const ref = useModal(open && mounted, () => setOpen(false));
  if (!mounted) return null;

  return (
    <div className={`overlay overlay--drawer ${shown ? 'is-open' : ''}`}>
      <div className="overlay__backdrop" onClick={() => setOpen(false)} aria-hidden="true" />
      <aside ref={ref} className="drawer" role="dialog" aria-modal="true" aria-labelledby="panier-titre">
        <div className="drawer__bar">
          <h2 id="panier-titre" className="drawer__title">
            Panier <span className="drawer__count">({count})</span>
          </h2>
          <button type="button" className="sheet__close" onClick={() => setOpen(false)} data-autofocus>
            Fermer
          </button>
        </div>

        {lines.length === 0 ? (
          <div className="drawer__empty">
            <p>Votre panier est vide.</p>
            <a
              className="btn"
              href="#boutique"
              onClick={(e) => {
                e.preventDefault();
                setOpen(false);
                window.setTimeout(() => scrollToHash('#boutique'), 80);
              }}
            >
              Découvrir la collection
            </a>
          </div>
        ) : (
          <>
            <ul className="drawer__lines">
              {lines.map((l) => (
                <li key={l.key} className="line">
                  <span className="line__thumb">
                    <img src={l.produit.image.thumb} width="160" height="200" alt="" loading="lazy" decoding="async" className="cover" />
                  </span>
                  <div className="line__info">
                    <p className="line__name">{l.produit.nom}</p>
                    <p className="line__meta">
                      {collectionTitle[l.produit.collection]}
                      {l.taille ? ` · Taille ${l.taille}` : ''}
                    </p>
                    <p className="line__price">{formatPrix(typeof l.produit.prix === 'number' ? l.produit.prix * l.qty : null)}</p>
                    <div className="line__row">
                      <div className="qty" role="group" aria-label={`Quantité — ${l.produit.nom}`}>
                        <button type="button" onClick={() => setQty(l.key, l.qty - 1)} aria-label="Retirer un">
                          −
                        </button>
                        <span aria-live="polite">{l.qty}</span>
                        <button type="button" onClick={() => setQty(l.key, l.qty + 1)} aria-label="Ajouter un" disabled={l.qty >= 9}>
                          +
                        </button>
                      </div>
                      <button type="button" className="link link--small" onClick={() => remove(l.key)}>
                        Retirer
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="drawer__foot">
              <div className="drawer__total">
                <span>Sous-total</span>
                <span>{subtotal != null ? formatPrix(subtotal) : 'Prix à venir'}</span>
              </div>
              <button type="button" className="btn btn--full btn--solid" disabled aria-describedby="panier-note">
                Valider la commande
              </button>
              <p id="panier-note" className="drawer__note">
                La commande en ligne sera ouverte prochainement. Votre sélection est conservée sur cet appareil.
              </p>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
