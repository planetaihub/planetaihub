import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [
      react(),
      tailwindcss(),
      // Copies public/ and src/assets into dist/ so static assets (ads.txt, robots.txt,
      // sitemap.xml, PWA assets, and unbundled images) are guaranteed to be present in dist/
      {
        name: 'guarantee-dist-static-assets',
        apply: 'build',
        closeBundle(error?: Error): void {
          if (error) {
            return;
          }
          const distDir = path.resolve(process.cwd(), 'dist');
          const publicDir = path.resolve(process.cwd(), 'public');
          const srcAssets = path.resolve(process.cwd(), 'src/assets');
          const distAssets = path.resolve(distDir, 'src/assets');

          if (fs.existsSync(distDir)) {
            // Guarantee all static files from public/ are copied to root of dist/
            if (fs.existsSync(publicDir)) {
              fs.cpSync(publicDir, distDir, {recursive: true, force: true});
            }
            // Preserve unbundled src/assets
            if (fs.existsSync(srcAssets)) {
              fs.cpSync(srcAssets, distAssets, {recursive: true, force: true});
            }
          }
        },
      },
    ],
    publicDir: path.resolve(process.cwd(), 'public'),
    build: {
      outDir: 'dist',
      copyPublicDir: true,
    },
    resolve: {
      dedupe: ['react', 'react-dom'],
      alias: {
        '@': path.resolve(process.cwd(), '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
