import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

/* Duas entradas:

     /          a landing do Pomerode Auto Center
     /sistema   a bancada: agenda dos boxes, OS, recibo e Easy-NFe

   A bancada é MPA e não rota de SPA porque ela carrega three.js zero e
   não deve pagar o peso da cena da capa para abrir uma agenda. */
export default defineConfig({
  plugins: [react(), tailwindcss()],
  appType: 'mpa',
  build: {
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        sistema: resolve(import.meta.dirname, 'sistema.html'),
      },
    },
  },
  resolve: { alias: { '@': resolve(import.meta.dirname, 'src') } },
  server: { host: true, port: 3010 },
  preview: { host: true, port: 3010, allowedHosts: true },
});
