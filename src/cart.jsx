import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useState } from 'react';
import { devise, produits } from './content/site.js';

/**
 * Panier — état local, conservé dans le navigateur du visiteur.
 * Une ligne = un produit (+ taille si renseignée).
 */
const STORAGE = 'cp:panier';
const FAV_STORAGE = 'cp:favoris';
const byId = Object.fromEntries(produits.map((p) => [p.id, p]));
const lineKey = (id, taille) => (taille ? `${id}::${taille}` : id);

function load() {
  try {
    const raw = JSON.parse(window.localStorage.getItem(STORAGE) || '[]');
    return Array.isArray(raw) ? raw.filter((l) => byId[l.id] && l.qty > 0) : [];
  } catch {
    return [];
  }
}

function reducer(lines, action) {
  switch (action.type) {
    case 'add': {
      const key = lineKey(action.id, action.taille);
      const found = lines.find((l) => l.key === key);
      if (found) return lines.map((l) => (l.key === key ? { ...l, qty: Math.min(l.qty + 1, 9) } : l));
      return [...lines, { key, id: action.id, taille: action.taille || null, qty: 1 }];
    }
    case 'qty':
      return lines
        .map((l) => (l.key === action.key ? { ...l, qty: Math.max(0, Math.min(action.qty, 9)) } : l))
        .filter((l) => l.qty > 0);
    case 'remove':
      return lines.filter((l) => l.key !== action.key);
    case 'clear':
      return [];
    default:
      return lines;
  }
}

function loadFavs() {
  try {
    const raw = JSON.parse(window.localStorage.getItem(FAV_STORAGE) || '[]');
    return Array.isArray(raw) ? raw.filter((id) => byId[id]) : [];
  } catch {
    return [];
  }
}

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [lines, dispatch] = useReducer(reducer, undefined, load);
  const [open, setOpenRaw] = useState(false);
  const [favs, setFavs] = useState(loadFavs);
  const [favOpen, setFavOpenRaw] = useState(false);
  const [toast, setToast] = useState(null); // { id, nom, n }

  // Un seul tiroir ouvert à la fois.
  const setOpen = useCallback((v) => {
    setOpenRaw(v);
    if (v) setFavOpenRaw(false);
  }, []);
  const setFavOpen = useCallback((v) => {
    setFavOpenRaw(v);
    if (v) setOpenRaw(false);
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(FAV_STORAGE, JSON.stringify(favs));
    } catch {
      /* stockage indisponible */
    }
  }, [favs]);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE, JSON.stringify(lines));
    } catch {
      /* stockage indisponible : le panier reste valable pour la visite */
    }
  }, [lines]);

  const add = useCallback((id, taille, { notify = false } = {}) => {
    dispatch({ type: 'add', id, taille });
    if (notify) setToast((t) => ({ id, nom: byId[id].nom, n: (t?.n || 0) + 1 }));
  }, []);
  const toggleFav = useCallback(
    (id) => setFavs((list) => (list.includes(id) ? list.filter((x) => x !== id) : [...list, id])),
    []
  );
  const setQty = useCallback((key, qty) => dispatch({ type: 'qty', key, qty }), []);
  const remove = useCallback((key) => dispatch({ type: 'remove', key }), []);

  const value = useMemo(() => {
    const detailed = lines.map((l) => ({ ...l, produit: byId[l.id] }));
    const count = lines.reduce((n, l) => n + l.qty, 0);
    const allPriced = detailed.length > 0 && detailed.every((l) => typeof l.produit.prix === 'number');
    const subtotal = allPriced ? detailed.reduce((s, l) => s + l.produit.prix * l.qty, 0) : null;
    return {
      lines: detailed,
      count,
      subtotal,
      add,
      setQty,
      remove,
      open,
      setOpen,
      favs,
      favProduits: favs.map((id) => byId[id]),
      isFav: (id) => favs.includes(id),
      toggleFav,
      favOpen,
      setFavOpen,
      toast,
      clearToast: () => setToast(null),
    };
  }, [lines, add, setQty, remove, open, setOpen, favs, toggleFav, favOpen, setFavOpen, toast]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => useContext(CartContext);

// « 1 290 MAD » — espace fine insécable pour les milliers.
export const formatPrix = (n) =>
  typeof n === 'number' ? `${n.toLocaleString('fr-FR').replace(/\s/g, '\u202f')}\u00a0${devise.code}` : 'Prix à venir';
