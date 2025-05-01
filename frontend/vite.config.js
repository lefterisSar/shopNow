import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@emotion/react': resolve(__dirname, 'node_modules/@emotion/react'),
      '@emotion/styled': resolve(__dirname, 'node_modules/@emotion/styled'),
    },
  },
})
