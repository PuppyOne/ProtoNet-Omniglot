import { tanstackRouter } from '@tanstack/router-plugin/vite';
import react from '@vitejs/plugin-react';
import Icons from 'unplugin-icons/vite';
import { defineConfig } from 'vite';


// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
    }),
    react({
      // @ts-expect-error  react compiler
      babel: {
        plugins: ['babel-plugin-react-compiler'],
      },
    }),
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
