import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['index.tsx'],
  format: ['esm', 'cjs'],
  dts: true,
  external: ['react'],
  esbuildOptions(options) {
    options.external = ['rehackt'];
  },
});
