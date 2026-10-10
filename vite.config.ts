import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => ({
  plugins: [react(), tailwindcss()],
  resolve: {
    // One import prefix for the whole app: @/shared/..., @/features/...
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  // The single-file build (npm run build:html) must work offline, so photos
  // are inlined into it instead of being separate files.
  build: mode === 'standalone' ? { assetsInlineLimit: 100_000_000 } : {},
}))
