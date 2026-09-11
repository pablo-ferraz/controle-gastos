import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

// Publicado em GitHub Pages como site de projeto, então tudo é servido
// em /controle-gastos/, não na raiz do domínio.
const base = '/controle-gastos/';

export default defineConfig({
  base,
  build: {
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (id.includes('node_modules')) {
            if (id.includes('ag-grid')) return 'vendor-ag-grid';
            if (id.includes('ag-charts')) return 'vendor-ag-charts';
            if (id.includes('react')) return 'vendor-react';
          }
          return undefined;
        },
      },
    },
  },
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'icons/apple-touch-icon.png'],
      manifest: {
        id: base,
        name: 'Controle de Gastos',
        short_name: 'Gastos',
        description: 'App pessoal para registrar gastos e acompanhar por categoria.',
        lang: 'pt-BR',
        theme_color: '#2a78d6',
        background_color: '#f9f9f7',
        display: 'standalone',
        start_url: base,
        scope: base,
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          {
            src: 'icons/icon-512-maskable.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico,woff2}'],
        // AG Grid + AG Charts deixam o bundle principal grande; sem isso o
        // Workbox recusa pré-cachear o JS e o app não funcionaria offline.
        maximumFileSizeToCacheInBytes: 6 * 1024 * 1024,
      },
    }),
  ],
});
