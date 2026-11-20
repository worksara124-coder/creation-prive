import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base './' : le build fonctionne depuis n'importe quel dossier ou hébergeur.
export default defineConfig({
  base: './',
  plugins: [react()],
});
