import { reactRouter } from '@react-router/dev/vite'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig, loadEnv } from 'vite'
import devtoolsJson from 'vite-plugin-devtools-json'

export default defineConfig(({ command, mode, isPreview }) => {
  const { API_PROXY_TARGET } = loadEnv(mode, process.cwd(), 'API_PROXY_')
  const useDevProxy = command === 'serve' && !isPreview
  if (useDevProxy && !API_PROXY_TARGET) throw new Error('Set API_PROXY_TARGET in .env before running pnpm dev')

  return {
    plugins: [tailwindcss(), reactRouter(), devtoolsJson()],
    server: {
      host: 'localhost',
      port: 5173,
      strictPort: true,
      proxy: useDevProxy
        ? {
            '/backend': {
              target: API_PROXY_TARGET,
              changeOrigin: true,
              rewrite: (path) => path.replace(/^\/backend/, '')
            }
          }
        : undefined
    },
    resolve: {
      tsconfigPaths: true
    },
    css: {
      devSourcemap: true
    },
    optimizeDeps: {
      include: [
        '@tanstack/react-query',
        'axios',
        'i18next',
        'react-i18next',
        'lucide-react',
        'motion/react',
        'recharts',
        'sonner'
      ]
    }
  }
})
