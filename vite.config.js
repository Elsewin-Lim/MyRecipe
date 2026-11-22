import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import babel from '@rolldown/plugin-babel';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/MyRecipe/' : '/',
  build: {
    cssTarget: ['chrome111', 'edge111', 'firefox114', 'safari16', 'ios16'], // paged.js can't parse so of the modern CSS syntax
  },
  plugins: [react(), babel({ presets: [reactCompilerPreset()] })],
}));
