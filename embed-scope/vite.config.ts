import babel from '@rolldown/plugin-babel';
import { tanstackRouter } from '@tanstack/router-plugin/vite';
import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import Icons from 'unplugin-icons/vite';
import { defineConfig } from 'vite';


// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
    }),
    react(),

    // https://github.com/vitejs/vite-plugin-react/tree/c1651ac5c2fc6026bd8f7b466313aedeb0c83830/packages/plugin-react#react-compiler
    babel({ presets: [reactCompilerPreset()] }),

    Icons({
      compiler: 'jsx',
      jsx: 'react',
      autoInstall: false,
    }),
  ],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  build: {
    outDir: 'dist-front',
  },
});
