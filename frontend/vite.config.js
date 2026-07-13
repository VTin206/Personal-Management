import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const processObject = globalThis.process
  const env = loadEnv(mode, processObject?.cwd?.() ?? import.meta.dirname, '')
  const processEnv = processObject?.env ?? {}
  const apiUrl = processEnv.VITE_API_URL ?? env.VITE_API_URL

  if (processEnv.VERCEL && !apiUrl) {
    throw new Error('VITE_API_URL is required for Vercel deployments.')
  }

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname, './src'),
      },
    },
  }
})
