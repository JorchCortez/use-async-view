import { defineConfig } from 'tsup';

export default defineConfig([
  // Main entry (web)
  {
    entry: ['src/index.ts'],
    format: ['esm', 'cjs'],
    dts: {
      compilerOptions: {
        jsx: 'react',
        allowSyntheticDefaultImports: true,
        esModuleInterop: true,
      },
    },
    sourcemap: true,
    clean: true,
    outDir: 'dist',
    external: ['react', 'react-dom'],
    treeshake: true,
  },
  // Native entry
  {
    entry: ['src/native.ts'],
    format: ['esm', 'cjs'],
    dts: false, // Skip DTS for native due to react-native type issues
    sourcemap: true,
    outDir: 'dist',
    outExtension({ format }) {
      return {
        js: format === 'esm' ? '.native.mjs' : '.native.js',
      };
    },
    external: ['react', 'react-native'],
    treeshake: true,
  },
  // Web entry (explicit)
  {
    entry: ['src/web.ts'],
    format: ['esm', 'cjs'],
    dts: {
      compilerOptions: {
        jsx: 'react',
        allowSyntheticDefaultImports: true,
        esModuleInterop: true,
      },
    },
    sourcemap: true,
    outDir: 'dist',
    outExtension({ format }) {
      return {
        js: format === 'esm' ? '.web.mjs' : '.web.js',
      };
    },
    external: ['react', 'react-dom'],
    treeshake: true,
  },
]);
