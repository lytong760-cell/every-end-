import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({
    plugins: [react()],
    server: {
        port: 3000,
        open: true,
    },
    build: {
        target: 'esnext',
    },
    optimizeDeps: {
        exclude: [
            '@babel/standalone',
            '@vue/compiler-sfc',
            'svelte/compiler',
            'esbuild-wasm',
            'pyodide',
        ],
    },
});
