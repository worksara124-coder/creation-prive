/**
 * CONTENU DU SITE — Création Privée (page d'accueil)
 * ------------------------------------------------------------------
 * Toutes les informations éditables sont regroupées ici.
 * Une valeur à `null` n'est pas affichée : rien n'est inventé.
 */

const m = (file) => `${import.meta.env.BASE_URL}media/${file}`;

export const media = {
  intro: {
    desktop: m('intro-1080.mp4'),
    mobile: m('intro-720.mp4'),
    // Version verticale pour téléphones : logo entier, même fin plein cadre.
    portrait: m('intro-portrait.mp4'),
    poster: m('poster-1920.jpg'),
    posterPortrait: m('poster-portrait-720.jpg'),
  },
  hero: {
    webp: `${m('hero-960.webp')} 960w, ${m('hero-1280.webp')} 1280w, ${m('hero-1672.webp')} 1672w`,
    jpg: m('hero-1672.jpg'),
    width: 1672,
    height: 941,
    alt: 'Femme en longue robe fluide couleur chocolat, marchant le long d’un mur ocre baigné de lumière.',
  },
  fabric: {
    webp: `${m('fabric-960.webp')} 960w, ${m('fabric-1440.webp')} 1440w, ${m('fabric-1920.webp')} 1920w`,
    jpg: m('fabric-1920.jpg'),
    width: 1920,
    height: 1080,
    alt: 'Gros plan d’un tissu satiné couleur chocolat, aux plis souples.',
  },
  logo: m('logo-choco.png'),
  monogram: m('monogram.png'),
};

/** Liens du menu : ancres vers les sections de l'accueil. */
export const navigation = [
  { label: 'Collections', href: '#collections' },
  { label: 'La Maison', href: '#maison' },
  { label: 'Contact', href: '#contact' },
];

export const hero = {
  title: ['L’élégance,', 'dans chaque détail.'],
  cta: { label: 'Découvrir la collection', href: '#collections' },
  sectionTitle: 'La nouvelle collection',
};

const images = {
  allure: {
    webp: m('allure-600.webp'),
    jpg: m('allure-600.jpg'),
    width: 600,
    height: 732,
    alt: 'Femme en tailleur beige, veste et pantalon large, sous une galerie d’arcades en pierre.',
  },
  elegance: {
    webp: m('elegance-569.webp'),
    jpg: m('elegance-569.jpg'),
    width: 569,
    height: 563,
    alt: 'Femme en robe noire drapée à manches longues, appuyée contre un mur ocre.',
  },
};

const photo = (name, alt) => ({
  webp: `${m(`${name}-560.webp`)} 560w, ${m(`${name}-840.webp`)} 840w, ${m(`${name}-1122.webp`)} 1122w`,
  jpg: m(`${name}-1122.jpg`),
  thumb: m(`${name}-thumb.webp`),
  width: 1122,
  height: 1402,
  alt,
});

/** Catégories du filtre de « La collection ». */
export const categories = [
  { id: 'tout', label: 'Tout' },
  { id: 'robes', label: 'Robes' },
  { id: 'ensembles', label: 'Ensembles' },
  { id: 'vestes', label: 'Vestes' },
];

/**
 * Produits.
 * - `prix` : en MAD (prix indicatifs). `null` → « Prix à venir ».
 * - `collection` : collection éditoriale où la pièce est aussi présentée.
 * - `tailles` : ex. ['S', 'M', 'L'] ou `null` → pas de sélecteur.
 */
export const produits = [
  {
    id: 'robe-chocolat',
    nom: 'Robe chocolat',
    categorie: 'robes',
    collection: 'elegance-essentielle',
    prix: 890,
    tailles: null,
    image: photo('robe-chocolat', 'Robe longue satinée couleur chocolat, col bénitier et drapé à la taille, portée de face.'),
  },
  {
    id: 'ensemble-beige',
    nom: 'Ensemble beige',
    categorie: 'ensembles',
    collection: 'allure-naturelle',
    prix: 1290,
    tailles: null,
    image: photo('ensemble-beige', 'Ensemble beige : blazer et pantalon large à pinces, porté avec un top ivoire.'),
  },
  {
    id: 'robe-noire',
    nom: 'Robe noire',
    categorie: 'robes',
    collection: 'elegance-essentielle',
    prix: 950,
    tailles: null,
    image: photo('robe-noire', 'Robe longue noire à manches longues, col bénitier et drapé sur le côté, portée de face.'),
  },
  {
    id: 'blazer-sable',
    nom: 'Blazer sable',
    categorie: 'vestes',
    collection: 'allure-naturelle',
    prix: 690,
    tailles: null,
    image: photo('blazer-sable', 'Blazer sable à un bouton, sur un cintre en bois.'),
  },
];

export const boutique = {
  title: 'La collection',
  subtitle: 'Des essentiels, tout simplement.',
  note: 'Prix indicatifs',
};

export const maison = {
  eyebrow: 'La Maison',
  title: ['L’élégance', 'prend forme.'],
  text: 'Des lignes fluides, des nuances douces, une allure singulière.',
  link: { label: 'Découvrir notre univers', href: '#matiere' },
  image: {
    ...photo('maison', 'Robe longue satinée chocolat sur un mannequin de couture, dans un atelier baigné de lumière.'),
  },
};

export const devise = { code: 'MAD' };

/**
 * Collections.
 * - `hoverImage` : deuxième photo (facultative) affichée au survol en fondu.
 */
export const collections = [
  {
    slug: 'allure-naturelle',
    title: 'L’allure naturelle',
    linkLabel: 'Découvrir',
    intro: 'Des lignes souples, des tons de pierre et de sable. Une silhouette qui se porte avec simplicité.',
    image: images.allure,
    hoverImage: null,
  },
  {
    slug: 'elegance-essentielle',
    title: 'L’élégance essentielle',
    linkLabel: 'Découvrir',
    intro: 'Le noir, un drapé, une ligne. L’essentiel, porté avec assurance.',
    image: images.elegance,
    hoverImage: null,
  },
];

export const matiere = {
  lines: ['La matière.', 'Le mouvement.', 'L’allure.'],
};

/** Coordonnées : n'apparaissent que lorsqu'elles sont renseignées. */
export const contact = {
  email: null, // ex. 'contact@exemple.com'
  telephone: null, // ex. '+212 6 00 00 00 00'
  adresse: null,
  instagram: null, // ex. { handle: '@creationprivee', url: 'https://instagram.com/…' }
};
