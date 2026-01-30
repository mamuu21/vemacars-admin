// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
// import path from "path"


// export default defineConfig({
//   server: {
//     port: 5173,
//     allowedHosts: ['peskier-unslaked-ken.ngrok-free.dev'],
//     proxy: {
//       '/api': {
//         target: 'http://localhost:8000',
//         changeOrigin: true,
//       }
//     }
//   },
//   plugins: [react()],
//   resolve: {
//     alias: {
//       '@': path.resolve(__dirname, './src'),
//     }
//   },
// })


import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  base: '/vemacars-admin/deploy/', // 👈 VERY IMPORTANT

  plugins: [react()],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    }
  }
})

