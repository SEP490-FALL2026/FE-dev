import { defineConfig, type Options } from 'orval'
import { loadEnv } from 'vite'

const env = loadEnv('development', process.cwd(), ['VITE_', 'API_PROXY_'])
const origin =
  process.env.API_PROXY_TARGET ?? env.API_PROXY_TARGET ?? process.env.VITE_API_BASE_URL ?? env.VITE_API_BASE_URL

export const apiConfig = {
  input: {
    target: new URL('/api/docs-json', origin).href,
    override: { transformer: './scripts/validate-orval-input.mjs' }
  },
  output: {
    baseUrl: {
      runtime: 'env.API_BASE_URL',
      imports: [
        {
          name: 'env',
          importPath: '~/shared/config/env'
        }
      ]
    },
    clean: true,
    client: 'react-query',
    formatter: 'prettier',
    httpClient: 'axios',
    mode: 'tags-operations',
    indexFiles: true,
    override: {
      mutator: {
        path: './app/shared/api/mutator/custom-axios.ts',
        name: 'customAxios'
      }
    },
    schemas: {
      path: './app/shared/api/generated/model',
      splitByTags: true
    },
    target: './app/shared/api/generated/operations'
  }
} satisfies Options

export default defineConfig({ api: apiConfig })
