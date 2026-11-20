import Header from './components/Header.jsx';
import HeroStage from './components/HeroStage.jsx';
import CartDrawer from './components/CartDrawer.jsx';
import { CartToast, FavDrawer } from './components/FavDrawer.jsx';
import { BoutiqueSection, MaisonSection } from './components/Boutique.jsx';
import { CollectionsSection, Footer, MatiereSection } from './components/Sections.jsx';
import { CartProvider } from './cart.jsx';

export default function App() {
  return (
    <CartProvider>
      <a
        className="skip-link"
        href="#collections"
        onClick={(e) => {
          e.preventDefault();
          const el = document.getElementById('collections');
          el?.scrollIntoView();
          el?.querySelector('button.link')?.focus({ preventScroll: true });
        }}
      >
        Aller au contenu
      </a>
      <Header />
      <main id="contenu">
        <HeroStage />
        <CollectionsSection />
        <BoutiqueSection />
        <MaisonSection />
        <MatiereSection />
      </main>
      <Footer />
      <CartDrawer />
      <FavDrawer />
      <CartToast />
    </CartProvider>
  );
}
