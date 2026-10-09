import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import tailwindcss from '@tailwindcss/vite'

const DEMO = process.env.VITE_DEMO === '1'
export default defineConfig({
  base: DEMO ? './' : '/',
  plugins: [
    react(),
    tailwindcss(),
    !DEMO && VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon.svg'],
      manifest: {
        name: 'PossAbilities Portal',
        short_name: 'PossAbilities',
        description: 'News, Easy Read, workshops, groups and videos for the people PossAbilities supports.',
        theme_color: '#48065A',
        background_color: '#48065A',
        display: 'standalone',
        start_url: '/',
        icons: [{ src: '/icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any maskable' }]
      },
      workbox: { navigateFallbackDenylist: [/^\/auth/] }
    })
  ].filter(Boolean),
  server: { port: 5173 }

})
