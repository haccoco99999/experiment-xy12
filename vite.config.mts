import { fileURLToPath, URL } from 'node:url'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { defineConfig } from 'vite'
import { viteSingleFile } from 'vite-plugin-singlefile'

export default defineConfig({
  base: './',
  plugins: [
    svelte({
      emitCss: false
    }),
    viteSingleFile({
      removeViteModuleLoader: true
    })
  ],
  build: {
    target: 'es2020',
    outDir: 'dist-modern',
    emptyOutDir: true,
    cssCodeSplit: false,
    copyPublicDir: false,
    minify: 'oxc',
    lib: {
      entry: fileURLToPath(new URL('./src/lab-modern.ts', import.meta.url)),
      formats: ['iife'],
      name: 'LabModernBundle',
      fileName: () => 'lab-modern.js'
    },
    rollupOptions: {
      external: ['three'],
      output: {
        globals: {
          three: 'THREE'
        }
      }
    }
  }
})
