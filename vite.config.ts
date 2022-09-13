import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  css: {
    preprocessorOptions:{
      less: {
        modifyVars: {
          'primary-color': '#9FA3EF',
          'error-color': '#FF3C38',
          'btn-primary-color': '#090A17'
        },
        javascriptEnabled: true,
      },
    },
  },
})
