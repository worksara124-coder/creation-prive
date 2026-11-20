# Création Privée — maquette React

Stack : React 18 + Vite 7 (Node ≥ 20.19), CSS natif, police Poppins (auto-hébergée via @fontsource).

```bash
npm install
npm run dev      # développement
npm run build    # production → dist/
```

## Où modifier le contenu
Tout est dans `src/content/site.js` :
- `produits` : pièces de chaque collection (noms provisoires), `prix` en MAD et `tailles` → masqués tant qu'ils valent `null`.
- `collections[].hoverImage` : deuxième photo en fondu au survol.
- `contact` : e-mail, téléphone, adresse, Instagram → affichés dans le pied de page dès qu'ils sont renseignés.

## Page d'accueil
- Intro vidéo (une fois par session) → fondu vers le visuel du hero → cadre qui se réduit au scroll.
- Collections : « Découvrir » ouvre la présentation de la collection avec ses pièces.
- Panier : tiroir latéral, quantités, conservé sur l'appareil (localStorage). Validation désactivée tant que la commande en ligne n'est pas branchée.
- Menu : ancres #collections, #maison, #contact.
