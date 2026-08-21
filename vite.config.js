import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// No GitHub Pages o site vive em /nome-do-repo/, nao na raiz do dominio.
// O workflow define VITE_BASE; na Vercel/Netlify fica '/' e nada muda.
const base = process.env.VITE_BASE || '/'

export default defineConfig({
  base,
  plugins: [react()],
  server: { port: 5173 },
  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        // Vite 8 (rolldown) exige funcao, nao objeto.
        manualChunks(id) {
          if (!id.includes('node_modules')) return
          if (/[\\/](react|react-dom|react-router|react-router-dom|scheduler)[\\/]/.test(id)) return 'react'
        },
      },
    },
  },
})
