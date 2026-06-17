import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        // This caches all your app's code, styling, and local icons
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        
        // This specifically catches and saves your Cloudinary images for offline use
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/res\.cloudinary\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'cloudinary-images',
              expiration: {
                maxEntries: 500, // Saves up to 500 images
                maxAgeSeconds: 60 * 60 * 24 * 30 // Keeps them for 30 days
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      }
    })
  ],
})
