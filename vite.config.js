import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 5000, // Porta do servidor de desenvolvimento
  },
  build: {
    outDir: 'dist', // Diretório de saída para a build
  },
});