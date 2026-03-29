import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import glsl from 'vite-plugin-glsl';
import babel from '@rolldown/plugin-babel';

export default defineConfig({
  base: './',
  plugins: [
    react(),
    glsl(),
    babel({
      presets: [reactCompilerPreset()],
    }),
  ],
  resolve: {
    dedupe: ['three'],
  },
});
